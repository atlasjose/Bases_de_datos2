-- Usuarios (ajustado a la nueva estructura)
INSERT INTO usuario (username, email, contrasena, fecha_registro) VALUES
('Ana Ruiz', 'ana@example.com', 'pass123', '2025-01-15'),
('Luis Pérez', 'luis@example.com', 'pass456', '2025-02-01'),
('Marta Díaz', 'marta@example.com', 'pass789', '2025-02-10'),
('Carlos Méndez', 'carlos@example.com', 'passabc', '2025-03-05'),
('Julia Torres', 'julia@example.com', 'passxyz', '2025-04-20');

-- Encuestas
INSERT INTO encuesta (id_usuario, titulo, descripcion, fecha_creacion, activa) VALUES
(1, 'Satisfacción de Usuarios', 'Encuesta sobre experiencia de usuario', '2025-05-01', TRUE),
(2, 'Preferencias de Producto', 'Qué características valoran más los clientes', '2025-05-10', TRUE),
(3, 'Evaluación de Talleres', 'Feedback sobre nuestros cursos de formación', '2025-05-20', FALSE);

-- Preguntas
INSERT INTO pregunta (id_encuesta, texto, tipo) VALUES
(1, '¿Cómo calificaría nuestra plataforma?', 'opcion_multiple'),
(1, '¿Qué funcionalidad le gustaría ver mejorada?', 'seleccion_multiple'),
(2, '¿Qué producto usa con más frecuencia?', 'opcion_unica'),
(3, 'Califique la utilidad del contenido (1-5)', 'escala'),
(3, '¿Recomendaría este taller a otros?', 'si_no');

-- Opciones de Respuesta
INSERT INTO opcion_respuesta (id_pregunta, texto) VALUES
(1, 'Excelente'),
(1, 'Buena'),
(1, 'Regular'),
(1, 'Mala'),
(2, 'Velocidad'),
(2, 'Diseño'),
(2, 'Funcionalidades'),
(3, 'Producto A'),
(3, 'Producto B'),
(3, 'Producto C'),
(4, '1'),
(4, '2'),
(4, '3'),
(4, '4'),
(4, '5'),
(5, 'Sí'),
(5, 'No');

-- Votos
INSERT INTO voto (id_usuario, id_opcion, fecha_voto) VALUES
(1, 1, '2025-05-02'),  -- Ana vota "Excelente" en pregunta 1
(2, 4, '2025-05-03'),  -- Luis vota "Mala" en pregunta 1
(3, 2, '2025-05-03'),  -- Marta vota "Buena" en pregunta 1
(4, 7, '2025-05-15'),  -- Carlos vota "Velocidad" en pregunta 2
(5, 8, '2025-05-15'),  -- Julia vota "Funcionalidades" en pregunta 2
(1, 10, '2025-05-11'), -- Ana vota "Producto B" en pregunta 3
(3, 13, '2025-05-21'), -- Marta vota "3" en pregunta 4
(5, 16, '2025-05-21'); -- Julia vota "Sí" en pregunta 5

-- Estadísticas de Encuestas
INSERT INTO estadistica_encuesta (id_encuesta, total_votos, ultima_actualizacion) VALUES
(1, 5, '2025-05-03'),
(2, 2, '2025-05-15'),
(3, 3, '2025-05-21');