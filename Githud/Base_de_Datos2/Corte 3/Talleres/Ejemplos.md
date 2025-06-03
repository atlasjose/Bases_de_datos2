-- =================================================================
-- TRIGGERS ADAPTADOS AL DIAGRAMA DE BASE DE DATOS
-- =================================================================

-- ✅ **1. TRIGGER DE AUDITORÍA DE VOTOS**
-- Objetivo: Registrar automáticamente cada voto realizado para auditoría

CREATE OR REPLACE FUNCTION fn_auditoria_voto()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar registro de auditoría cuando se inserta un voto
    INSERT INTO estadistica_encuesta (
        id_encuesta,
        total_votos,
        ultima_actualizacion
    )
    VALUES (
        (SELECT id_encuesta FROM pregunta WHERE id_pregunta = 
         (SELECT id_pregunta FROM opcion_respuesta WHERE id_opcion = NEW.id_opcion)),
        1, -- Se incrementará con un UPDATE posterior
        CURRENT_DATE
    )
    ON CONFLICT (id_encuesta) DO UPDATE SET
        total_votos = estadistica_encuesta.total_votos + 1,
        ultima_actualizacion = CURRENT_DATE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auditoria_voto
    AFTER INSERT ON voto
    FOR EACH ROW
    EXECUTE FUNCTION fn_auditoria_voto();

-- ✅ **2. TRIGGER DE NOTIFICACIÓN AL CREAR ENCUESTA**
-- Objetivo: Notificar automáticamente cuando se activa una encuesta

CREATE OR REPLACE FUNCTION fn_notificar_encuesta_activa()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo notificar si la encuesta se activa (activa = true)
    IF NEW.activa = true AND (OLD IS NULL OR OLD.activa = false) THEN
        -- Aquí podrías insertar en una tabla de notificaciones si existiera
        -- Por ahora, actualizamos las estadísticas
        INSERT INTO estadistica_encuesta (
            id_encuesta,
            total_votos,
            ultima_actualizacion
        )
        VALUES (
            NEW.id_encuesta,
            0,
            CURRENT_DATE
        )
        ON CONFLICT (id_encuesta) DO UPDATE SET
            ultima_actualizacion = CURRENT_DATE;
            
        RAISE NOTICE 'Encuesta "%" ha sido activada el %', NEW.titulo, NEW.fecha_creacion;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notificar_encuesta_activa
    AFTER INSERT OR UPDATE ON encuesta
    FOR EACH ROW
    EXECUTE FUNCTION fn_notificar_encuesta_activa();

-- ✅ **3. TRIGGER DE VALIDACIÓN DE USUARIOS**
-- Objetivo: Validar que el email sea único y tenga formato correcto

CREATE OR REPLACE FUNCTION fn_validar_usuario()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar formato de email
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'El email "%" no tiene un formato válido', NEW.email;
    END IF;
    
    -- Validar que el username no esté vacío
    IF NEW.username IS NULL OR trim(NEW.username) = '' THEN
        RAISE EXCEPTION 'El nombre de usuario no puede estar vacío';
    END IF;
    
    -- Validar que la contraseña tenga al menos 8 caracteres
    IF NEW.contraseña IS NULL OR length(NEW.contraseña) < 8 THEN
        RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_usuario
    BEFORE INSERT OR UPDATE ON usuario
    FOR EACH ROW
    EXECUTE FUNCTION fn_validar_usuario();

-- =================================================================
-- EJEMPLOS DE USO DE LOS TRIGGERS
-- =================================================================

-- ✅ **Ejemplo 1: Trigger de auditoría de votos**
/*
-- Insertamos un voto (esto activará el trigger de auditoría)
INSERT INTO voto (id_usuario, id_opcion, fecha_voto)
VALUES (1, 1, CURRENT_DATE);

-- Verificamos que se actualizaron las estadísticas
SELECT * FROM estadistica_encuesta WHERE id_encuesta = 1;
*/

-- ✅ **Ejemplo 2: Trigger de notificación de encuesta activa**
/*
-- Activamos una encuesta (esto mostrará una notificación)
UPDATE encuesta 
SET activa = true 
WHERE id_encuesta = 1;

-- El trigger mostrará un mensaje: "Encuesta 'Título' ha sido activada el 2025-06-03"
*/

-- ✅ **Ejemplo 3: Trigger de validación de usuarios**
/*
-- Ejemplo CORRECTO ✅
INSERT INTO usuario (username, email, contraseña, fecha_registro)
VALUES ('juan_perez', 'juan@email.com', 'password123', CURRENT_DATE);

-- Ejemplo INCORRECTO ❌ (email inválido)
INSERT INTO usuario (username, email, contraseña, fecha_registro)
VALUES ('maria_lopez', 'email-invalido', 'pass123456', CURRENT_DATE);
-- Error: El email "email-invalido" no tiene un formato válido

-- Ejemplo INCORRECTO ❌ (contraseña muy corta)
INSERT INTO usuario (username, email, contraseña, fecha_registro)
VALUES ('pedro_sanchez', 'pedro@email.com', '123', CURRENT_DATE);
-- Error: La contraseña debe tener al menos 8 caracteres
*/

-- =================================================================
-- FUNCIONES AUXILIARES PARA CONSULTAS
-- =================================================================

-- Función para obtener estadísticas de una encuesta
CREATE OR REPLACE FUNCTION obtener_estadisticas_encuesta(p_id_encuesta INTEGER)
RETURNS TABLE (
    titulo_encuesta VARCHAR,
    total_votos INTEGER,
    fecha_ultima_actualizacion DATE,
    estado_encuesta BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.titulo,
        COALESCE(ee.total_votos, 0),
        ee.ultima_actualizacion,
        e.activa
    FROM encuesta e
    LEFT JOIN estadistica_encuesta ee ON e.id_encuesta = ee.id_encuesta
    WHERE e.id_encuesta = p_id_encuesta;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el resumen de votos por opción
CREATE OR REPLACE FUNCTION obtener_resumen_votos(p_id_encuesta INTEGER)
RETURNS TABLE (
    pregunta_texto TEXT,
    opcion_texto VARCHAR,
    cantidad_votos BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.texto,
        op.texto,
        COUNT(v.id_voto)
    FROM pregunta p
    JOIN opcion_respuesta op ON p.id_pregunta = op.id_pregunta
    LEFT JOIN voto v ON op.id_opcion = v.id_opcion
    WHERE p.id_encuesta = p_id_encuesta
    GROUP BY p.texto, op.texto
    ORDER BY p.texto, COUNT(v.id_voto) DESC;
END;
$$ LANGUAGE plpgsql;