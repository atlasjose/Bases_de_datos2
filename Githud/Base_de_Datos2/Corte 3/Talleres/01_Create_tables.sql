-- 1. Tabla usuario (ajustada al modelo)
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL,
    fecha_registro DATE DEFAULT CURRENT_DATE
);

-- 2. Tabla encuesta
CREATE TABLE encuesta (
    id_encuesta SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    activa BOOLEAN DEFAULT TRUE
);

-- 3. Tabla pregunta
CREATE TABLE pregunta (
    id_pregunta SERIAL PRIMARY KEY,
    id_encuesta INT NOT NULL REFERENCES encuesta(id_encuesta),
    texto TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL
);

-- 4. Tabla opcion_respuesta
CREATE TABLE opcion_respuesta (
    id_opcion SERIAL PRIMARY KEY,
    id_pregunta INT NOT NULL REFERENCES pregunta(id_pregunta),
    texto VARCHAR(255) NOT NULL
);

-- 5. Tabla voto
CREATE TABLE voto (
    id_voto SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
    id_opcion INT NOT NULL REFERENCES opcion_respuesta(id_opcion),
    fecha_voto DATE DEFAULT CURRENT_DATE
);

-- 6. Tabla estadistica_encuesta
CREATE TABLE estadistica_encuesta (
    id_estadistica SERIAL PRIMARY KEY,
    id_encuesta INT NOT NULL REFERENCES encuesta(id_encuesta),
    total_votos INT,
    ultima_actualizacion DATE
);

-- Eliminación de tablas innecesarias (no requeridas en el modelo)
DROP TABLE IF EXISTS 
    notificaciones,
    historial,
    comentarios,
    archivo_entregable,
    archivo_tarea,
    revision_entregable,
    entregables,
    tarea_etiquetas,
    etiquetas,
    tarea_usuarios,
    subtareas,
    tareas,
    proyecto_usuarios,
    proyectos,
    categorias,
    prioridades,
    estados,
    roles CASCADE;