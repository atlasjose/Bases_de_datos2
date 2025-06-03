-- =================================================================
-- TRIGGERS ADAPTADOS AL DIAGRAMA DE BASE DE DATOS
-- =================================================================

-- ✅ **CASO 1: AUDITORÍA DE CAMBIOS EN VOTOS**
-- Problema: Registrar automáticamente cuándo un usuario cambia su voto
-- Solución: Trigger que registra cambios en la tabla de estadísticas

CREATE OR REPLACE FUNCTION registrar_cambio_voto()
RETURNS TRIGGER AS $
DECLARE
    encuesta_id INTEGER;
BEGIN
    -- Obtener el ID de la encuesta relacionada
    SELECT p.id_encuesta INTO encuesta_id
    FROM opcion_respuesta op
    JOIN pregunta p ON op.id_pregunta = p.id_pregunta
    WHERE op.id_opcion = NEW.id_opcion;
    
    -- Registrar el cambio en estadísticas
    INSERT INTO estadistica_encuesta (
        id_encuesta,
        total_votos,
        ultima_actualizacion
    )
    VALUES (
        encuesta_id,
        1,
        CURRENT_DATE
    )
    ON CONFLICT (id_encuesta) DO UPDATE SET
        total_votos = estadistica_encuesta.total_votos + 1,
        ultima_actualizacion = CURRENT_DATE;
    
    -- Log del cambio (simulando historial)
    RAISE NOTICE 'Voto registrado: Usuario % votó por opción % en encuesta %', 
                 NEW.id_usuario, NEW.id_opcion, encuesta_id;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cambio_voto
    AFTER INSERT ON voto
    FOR EACH ROW
    EXECUTE FUNCTION registrar_cambio_voto();

-- ✅ **CASO 2: NOTIFICACIÓN AUTOMÁTICA AL CREAR ENCUESTA**
-- Problema: Notificar automáticamente cuando se crea una nueva encuesta
-- Solución: Trigger que genera notificación al usuario creador

CREATE OR REPLACE FUNCTION notificar_nueva_encuesta()
RETURNS TRIGGER AS $
BEGIN
    -- Inicializar estadísticas para la nueva encuesta
    INSERT INTO estadistica_encuesta (
        id_encuesta,
        total_votos,
        ultima_actualizacion
    )
    VALUES (
        NEW.id_encuesta,
        0,
        CURRENT_DATE
    );
    
    -- Notificación al creador (simulada con NOTICE)
    RAISE NOTICE 'Nueva encuesta creada: "%" por usuario % el %', 
                 NEW.titulo, NEW.id_usuario, NEW.fecha_creacion;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notificar_nueva_encuesta
    AFTER INSERT ON encuesta
    FOR EACH ROW
    EXECUTE FUNCTION notificar_nueva_encuesta();

-- ✅ **CASO 3: VALIDACIÓN AUTOMÁTICA DE FECHAS EN ENCUESTAS**
-- Problema: Evitar que la fecha de creación sea posterior a la fecha actual
-- Solución: Trigger que valida fechas antes de insertar/actualizar

CREATE OR REPLACE FUNCTION validar_fecha_encuesta()
RETURNS TRIGGER AS $
BEGIN
    -- Validar que la fecha de creación no sea futura
    IF NEW.fecha_creacion > CURRENT_DATE THEN
        RAISE EXCEPTION 'La fecha de creación (%) no puede ser posterior a la fecha actual (%)',
                        NEW.fecha_creacion, CURRENT_DATE;
    END IF;
    
    -- Si no se especifica fecha, usar la actual
    IF NEW.fecha_creacion IS NULL THEN
        NEW.fecha_creacion := CURRENT_DATE;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_fecha_encuesta
    BEFORE INSERT OR UPDATE ON encuesta
    FOR EACH ROW
    EXECUTE FUNCTION validar_fecha_encuesta();

-- ✅ **CASO 4: VALIDACIÓN DE USUARIOS**
-- Problema: Validar datos de usuario antes de insertar
-- Solución: Trigger de validación completa

CREATE OR REPLACE FUNCTION validar_usuario()
RETURNS TRIGGER AS $
BEGIN
    -- Validar formato de email
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}

-- =================================================================
-- EJEMPLOS DE USO DE LOS TRIGGERS ADAPTADOS
-- =================================================================

-- ✅ **EJEMPLO 1: Trigger de auditoría de votos**
/*
-- Datos de prueba necesarios:
INSERT INTO usuario (username, email, contraseña, fecha_registro)
VALUES ('juan_perez', 'juan@email.com', 'password123', CURRENT_DATE);

INSERT INTO encuesta (id_usuario, titulo, descripcion, fecha_creacion, activa)
VALUES (1, 'Encuesta de Satisfacción', 'Evalúa nuestro servicio', CURRENT_DATE, true);

INSERT INTO pregunta (id_encuesta, texto, tipo)
VALUES (1, '¿Cómo calificarías nuestro servicio?', 'multiple');

INSERT INTO opcion_respuesta (id_pregunta, texto)
VALUES (1, 'Excelente'), (1, 'Bueno'), (1, 'Regular');

-- Insertar voto (activará el trigger de auditoría)
INSERT INTO voto (id_usuario, id_opcion, fecha_voto)
VALUES (1, 1, CURRENT_DATE);

-- Verificar que se actualizaron las estadísticas
SELECT * FROM estadistica_encuesta WHERE id_encuesta = 1;
-- Resultado: Se ve total_votos = 1 y ultima_actualizacion = fecha actual
*/

-- ✅ **EJEMPLO 2: Trigger de notificación de nueva encuesta**
/*
-- Crear nueva encuesta (activará el trigger de notificación)
INSERT INTO encuesta (id_usuario, titulo, descripcion, fecha_creacion, activa)
VALUES (1, 'Nueva Encuesta de Prueba', 'Descripción de prueba', CURRENT_DATE, false);

-- El trigger mostrará: "Nueva encuesta creada: 'Nueva Encuesta de Prueba' por usuario 1 el 2025-06-03"
-- Y inicializará las estadísticas con total_votos = 0
*/

-- ✅ **EJEMPLO 3: Trigger de validación de fechas**
/*
-- Ejemplo CORRECTO ✅ (fecha actual o pasada)
INSERT INTO encuesta (id_usuario, titulo, descripcion, fecha_creacion, activa)
VALUES (1, 'Encuesta Válida', 'Fecha correcta', CURRENT_DATE, true);

-- Ejemplo INCORRECTO ❌ (fecha futura)
INSERT INTO encuesta (id_usuario, titulo, descripcion, fecha_creacion, activa)
VALUES (1, 'Encuesta Inválida', 'Fecha incorrecta', '2025-12-31', true);
-- Error: La fecha de creación (2025-12-31) no puede ser posterior a la fecha actual (2025-06-03)

-- Ejemplo con fecha NULL (se asignará automáticamente la fecha actual)
INSERT INTO encuesta (id_usuario, titulo, descripcion, fecha_creacion, activa)
VALUES (1, 'Encuesta Sin Fecha', 'Fecha se asignará automáticamente', NULL, true);
*/

-- ✅ **EJEMPLO 4: Trigger de validación de usuarios**
/*
-- Ejemplo CORRECTO ✅
INSERT INTO usuario (username, email, contraseña, fecha_registro)
VALUES ('maria_lopez', 'maria@email.com', 'contraseña123', CURRENT_DATE);

-- Ejemplo INCORRECTO ❌ (email inválido)
INSERT INTO usuario (username, email, contraseña, fecha_registro)
VALUES ('pedro_sanchez', 'email-invalido', 'password123', CURRENT_DATE);
-- Error: El email "email-invalido" no tiene un formato válido

-- Ejemplo INCORRECTO ❌ (contraseña muy corta)
INSERT INTO usuario (username, email, contraseña, fecha_registro)
VALUES ('ana_garcia', 'ana@email.com', '123', CURRENT_DATE);
-- Error: La contraseña debe tener al menos 8 caracteres

-- Ejemplo INCORRECTO ❌ (username vacío)
INSERT INTO usuario (username, email, contraseña, fecha_registro)
VALUES ('', 'usuario@email.com', 'password123', CURRENT_DATE);
-- Error: El nombre de usuario no puede estar vacío
*/

-- =================================================================
-- FUNCIONES AUXILIARES PARA CONSULTAS
-- =================================================================

-- Función para obtener estadísticas completas de una encuesta
CREATE OR REPLACE FUNCTION obtener_estadisticas_encuesta(p_id_encuesta INTEGER)
RETURNS TABLE (
    titulo_encuesta VARCHAR,
    descripcion_encuesta TEXT,
    creador_username VARCHAR,
    fecha_creacion DATE,
    total_votos INTEGER,
    fecha_ultima_actualizacion DATE,
    estado_encuesta BOOLEAN
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        e.titulo,
        e.descripcion,
        u.username,
        e.fecha_creacion,
        COALESCE(ee.total_votos, 0),
        ee.ultima_actualizacion,
        e.activa
    FROM encuesta e
    JOIN usuario u ON e.id_usuario = u.id_usuario
    LEFT JOIN estadistica_encuesta ee ON e.id_encuesta = ee.id_encuesta
    WHERE e.id_encuesta = p_id_encuesta;
END;
$ LANGUAGE plpgsql;

-- Función para obtener el resumen detallado de votos por opción
CREATE OR REPLACE FUNCTION obtener_resumen_votos(p_id_encuesta INTEGER)
RETURNS TABLE (
    pregunta_texto TEXT,
    pregunta_tipo VARCHAR,
    opcion_texto VARCHAR,
    cantidad_votos BIGINT,
    porcentaje_votos NUMERIC(5,2)
) AS $
BEGIN
    RETURN QUERY
    WITH votos_por_pregunta AS (
        SELECT 
            p.id_pregunta,
            COUNT(v.id_voto) as total_votos_pregunta
        FROM pregunta p
        LEFT JOIN opcion_respuesta op ON p.id_pregunta = op.id_pregunta
        LEFT JOIN voto v ON op.id_opcion = v.id_opcion
        WHERE p.id_encuesta = p_id_encuesta
        GROUP BY p.id_pregunta
    )
    SELECT 
        p.texto,
        p.tipo,
        op.texto,
        COUNT(v.id_voto),
        CASE 
            WHEN vpp.total_votos_pregunta > 0 THEN
                ROUND((COUNT(v.id_voto) * 100.0 / vpp.total_votos_pregunta), 2)
            ELSE 0.00
        END
    FROM pregunta p
    JOIN opcion_respuesta op ON p.id_pregunta = op.id_pregunta
    LEFT JOIN voto v ON op.id_opcion = v.id_opcion
    JOIN votos_por_pregunta vpp ON p.id_pregunta = vpp.id_pregunta
    WHERE p.id_encuesta = p_id_encuesta
    GROUP BY p.texto, p.tipo, op.texto, vpp.total_votos_pregunta
    ORDER BY p.texto, COUNT(v.id_voto) DESC;
END;
$ LANGUAGE plpgsql;

-- Función para validar si un usuario ya votó en una encuesta
CREATE OR REPLACE FUNCTION usuario_ya_voto(p_id_usuario INTEGER, p_id_encuesta INTEGER)
RETURNS BOOLEAN AS $
DECLARE
    voto_existente INTEGER;
BEGIN
    SELECT COUNT(*) INTO voto_existente
    FROM voto v
    JOIN opcion_respuesta op ON v.id_opcion = op.id_opcion
    JOIN pregunta p ON op.id_pregunta = p.id_pregunta
    WHERE v.id_usuario = p_id_usuario 
    AND p.id_encuesta = p_id_encuesta;
    
    RETURN voto_existente > 0;
END;
$ LANGUAGE plpgsql; THEN
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
    
    -- Asignar fecha de registro si no se especifica
    IF NEW.fecha_registro IS NULL THEN
        NEW.fecha_registro := CURRENT_DATE;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_usuario
    BEFORE INSERT OR UPDATE ON usuario
    FOR EACH ROW
    EXECUTE FUNCTION validar_usuario();

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