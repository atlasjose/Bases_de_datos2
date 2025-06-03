-- =================================================================
-- 📌 DISPARADORES (TRIGGERS) ADAPTADOS AL MODELO DE ENCUESTAS
-- =================================================================

/*
¿QUÉ SON LOS DISPARADORES?
Los disparadores o triggers son objetos de la base de datos que se ejecutan 
automáticamente cuando ocurre un evento específico sobre una tabla.

EVENTOS QUE PUEDEN DISPARAR UN TRIGGER:
- INSERT (cuando se inserta un nuevo dato)
- UPDATE (cuando se actualiza un dato)  
- DELETE (cuando se elimina un dato)

USOS PRINCIPALES EN NUESTRO MODELO DE ENCUESTAS:
✅ Validar datos antes de insertar/actualizar
✅ Registrar cambios para auditoría
✅ Calcular estadísticas automáticamente
✅ Mantener consistencia entre tablas relacionadas
✅ Prevenir acciones indebidas

SINTAXIS BÁSICA EN POSTGRESQL:
CREATE OR REPLACE FUNCTION nombre_funcion()
RETURNS TRIGGER AS $
BEGIN
    -- Código que se ejecutará
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER nombre_disparador
AFTER INSERT ON nombre_tabla
FOR EACH ROW
EXECUTE FUNCTION nombre_funcion();
*/

-- =================================================================
-- TRIGGERS IMPLEMENTADOS PARA EL SISTEMA DE ENCUESTAS
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
-- 🧪 EJEMPLOS PRÁCTICOS DE USO DE LOS TRIGGERS
-- =================================================================

-- ✅ **EJEMPLO 1: Trigger de Auditoría y Estadísticas de Votos**
/*
-- Secuencia completa de prueba:

-- 1. Crear usuario
INSERT INTO usuario (username, email, contraseña)
VALUES ('ana_votante', 'ana@email.com', 'password123');
-- ✅ Trigger de validación activado: valida email, username y contraseña

-- 2. Crear encuesta
INSERT INTO encuesta (id_usuario, titulo, descripcion, activa)
VALUES (1, 'Satisfacción del Servicio', 'Evalúa nuestro servicio', true);
-- ✅ Trigger de nueva encuesta activado: inicializa estadísticas

-- 3. Crear pregunta y opciones
INSERT INTO pregunta (id_encuesta, texto, tipo)
VALUES (1, '¿Cómo calificarías nuestro servicio?', 'opcion_multiple');

INSERT INTO opcion_respuesta (id_pregunta, texto) VALUES 
(1, 'Excelente'), (1, 'Bueno'), (1, 'Regular'), (1, 'Malo');

-- 4. Registrar voto
INSERT INTO voto (id_usuario, id_opcion, fecha_voto)
VALUES (1, 1, CURRENT_DATE);
-- ✅ Trigger de auditoría activado: incrementa estadísticas automáticamente

-- 5. Verificar resultados
SELECT * FROM estadistica_encuesta WHERE id_encuesta = 1;
-- Resultado: total_votos = 1, ultima_actualizacion = fecha actual
*/

-- ❌ **EJEMPLO 2: Casos de Error Controlados por Triggers**
/*
-- Error 1: Email inválido
INSERT INTO usuario (username, email, contraseña)
VALUES ('usuario_error', 'email-sin-formato', 'password123');
-- 🚫 Error: [VALIDACIÓN] Email inválido: "email-sin-formato"

-- Error 2: Contraseña muy corta
INSERT INTO usuario (username, email, contraseña)
VALUES ('otro_usuario', 'valido@email.com', '123');
-- 🚫 Error: [VALIDACIÓN] La contraseña debe tener al menos 8 caracteres

-- Error 3: Fecha de encuesta futura
INSERT INTO encuesta (id_usuario, titulo, descripcion, fecha_creacion, activa)
VALUES (1, 'Encuesta Futura', 'No debería permitirse', '2026-01-01', true);
-- 🚫 Error: [VALIDACIÓN] La fecha de creación (2026-01-01) no puede ser posterior a hoy

-- Error 4: Intentar eliminar encuesta con votos
DELETE FROM encuesta WHERE id_encuesta = 1;
-- 🚫 Error: [PROTECCIÓN] No se puede eliminar la encuesta porque tiene votos
*/

-- ✅ **EJEMPLO 3: Funcionalidades Automáticas**
/*
-- Auto-asignación de fecha de registro
INSERT INTO usuario (username, email, contraseña, fecha_registro)
VALUES ('usuario_auto', 'auto@email.com', 'password123', NULL);
-- ✅ Se asigna automáticamente fecha_registro = CURRENT_DATE

-- Auto-asignación de fecha de creación de encuesta
INSERT INTO encuesta (id_usuario, titulo, descripcion, fecha_creacion, activa)
VALUES (1, 'Encuesta Auto-Fecha', 'Fecha automática', NULL, false);
-- ✅ Se asigna automáticamente fecha_creacion = CURRENT_DATE
*/

-- =================================================================
-- 📊 FUNCIONES AUXILIARES PARA ANÁLISIS DE DATOS
-- =================================================================

-- **Función 1: Estadísticas Completas de Encuesta**
CREATE OR REPLACE FUNCTION obtener_estadisticas_encuesta(p_id_encuesta INTEGER)
RETURNS TABLE (
    titulo_encuesta VARCHAR,
    descripcion_encuesta TEXT,
    creador_username VARCHAR,
    fecha_creacion DATE,
    total_votos INTEGER,
    fecha_ultima_actualizacion DATE,
    estado_encuesta BOOLEAN,
    dias_activa INTEGER
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
        e.activa,
        CURRENT_DATE - e.fecha_creacion as dias_activa
    FROM encuesta e
    JOIN usuario u ON e.id_usuario = u.id_usuario
    LEFT JOIN estadistica_encuesta ee ON e.id_encuesta = ee.id_encuesta
    WHERE e.id_encuesta = p_id_encuesta;
END;
$ LANGUAGE plpgsql;

-- **Función 2: Resumen Detallado de Votos**
CREATE OR REPLACE FUNCTION obtener_resumen_votos(p_id_encuesta INTEGER)
RETURNS TABLE (
    pregunta_texto TEXT,
    pregunta_tipo VARCHAR,
    opcion_texto VARCHAR,
    cantidad_votos BIGINT,
    porcentaje_votos NUMERIC(5,2),
    ranking_opcion INTEGER
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
    ),
    votos_con_ranking AS (
        SELECT 
            p.texto as pregunta_texto,
            p.tipo as pregunta_tipo,
            op.texto as opcion_texto,
            COUNT(v.id_voto) as cantidad_votos,
            vpp.total_votos_pregunta,
            ROW_NUMBER() OVER (PARTITION BY p.id_pregunta ORDER BY COUNT(v.id_voto) DESC) as ranking
        FROM pregunta p
        JOIN opcion_respuesta op ON p.id_pregunta = op.id_pregunta
        LEFT JOIN voto v ON op.id_opcion = v.id_opcion
        JOIN votos_por_pregunta vpp ON p.id_pregunta = vpp.id_pregunta
        WHERE p.id_encuesta = p_id_encuesta
        GROUP BY p.texto, p.tipo, op.texto, p.id_pregunta, vpp.total_votos_pregunta
    )
    SELECT 
        vcr.pregunta_texto,
        vcr.pregunta_tipo,
        vcr.opcion_texto,
        vcr.cantidad_votos,
        CASE 
            WHEN vcr.total_votos_pregunta > 0 THEN
                ROUND((vcr.cantidad_votos * 100.0 / vcr.total_votos_pregunta), 2)
            ELSE 0.00
        END as porcentaje_votos,
        vcr.ranking::INTEGER
    FROM votos_con_ranking vcr
    ORDER BY vcr.pregunta_texto, vcr.ranking;
END;
$ LANGUAGE plpgsql;

-- **Función 3: Validar Participación de Usuario**
CREATE OR REPLACE FUNCTION usuario_ya_voto(p_id_usuario INTEGER, p_id_encuesta INTEGER)
RETURNS BOOLEAN AS $
DECLARE
    voto_existente INTEGER;
    usuario_nombre VARCHAR(255);
    encuesta_titulo VARCHAR(255);
BEGIN
    -- Obtener nombres para el log
    SELECT u.username, e.titulo INTO usuario_nombre, encuesta_titulo
    FROM usuario u, encuesta e
    WHERE u.id_usuario = p_id_usuario AND e.id_encuesta = p_id_encuesta;
    
    -- Contar votos existentes
    SELECT COUNT(*) INTO voto_existente
    FROM voto v
    JOIN opcion_respuesta op ON v.id_opcion = op.id_opcion
    JOIN pregunta p ON op.id_pregunta = p.id_pregunta
    WHERE v.id_usuario = p_id_usuario 
    AND p.id_encuesta = p_id_encuesta;
    
    -- Log informativo
    IF voto_existente > 0 THEN
        RAISE NOTICE '[VERIFICACIÓN] Usuario "%" ya participó en encuesta "%"', 
                     usuario_nombre, encuesta_titulo;
    ELSE
        RAISE NOTICE '[VERIFICACIÓN] Usuario "%" puede participar en encuesta "%"', 
                     usuario_nombre, encuesta_titulo;
    END IF;
    
    RETURN voto_existente > 0;
END;
$ LANGUAGE plpgsql;

-- **Función 4: Dashboard de Encuestas**
CREATE OR REPLACE FUNCTION dashboard_encuestas()
RETURNS TABLE (
    total_encuestas BIGINT,
    encuestas_activas BIGINT,
    total_usuarios BIGINT,
    total_votos BIGINT,
    encuesta_mas_popular VARCHAR,
    votos_encuesta_popular INTEGER
) AS $
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*) as total_enc,
            COUNT(*) FILTER (WHERE activa = true) as enc_activas
        FROM encuesta
    ),
    votos_stats AS (
        SELECT 
            COUNT(*) as total_vot,
            COUNT(DISTINCT id_usuario) as total_usr
        FROM voto
    ),
    popular AS (
        SELECT 
            e.titulo,
            ee.total_votos
        FROM encuesta e
        JOIN estadistica_encuesta ee ON e.id_encuesta = ee.id_encuesta
        ORDER BY ee.total_votos DESC
        LIMIT 1
    )
    SELECT 
        s.total_enc,
        s.enc_activas,
        vs.total_usr,
        vs.total_vot,
        p.titulo,
        p.total_votos
    FROM stats s, votos_stats vs, popular p;
END;
$ LANGUAGE plpgsql;

-- =================================================================
-- 🎯 CONSULTAS DE EJEMPLO PARA USAR LAS FUNCIONES
-- =================================================================

/*
-- Obtener estadísticas de una encuesta específica
SELECT * FROM obtener_estadisticas_encuesta(1);

-- Ver resumen detallado de votos con porcentajes
SELECT * FROM obtener_resumen_votos(1);

-- Verificar si un usuario ya votó
SELECT usuario_ya_voto(1, 1);

-- Dashboard general del sistema
SELECT * FROM dashboard_encuestas();

-- Consulta combinada: encuestas con más participación
SELECT 
    e.titulo,
    est.*
FROM obtener_estadisticas_encuesta(e.id_encuesta) est
JOIN encuesta e ON e.titulo = est.titulo_encuesta
WHERE est.total_votos > 0
ORDER BY est.total_votos DESC;
*/-invalido" no tiene un formato válido

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