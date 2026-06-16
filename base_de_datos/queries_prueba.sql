-- =========================================
-- CONSULTAS EXPLORATORIAS Y DE PRUEBA
-- =========================================

-- Ver los roles existentes
SELECT * FROM roles;

-- Ver un usuario de prueba
SELECT * FROM usuarios LIMIT 1;

-- Obtener usuarios con sus respectivos nombres de rol
SELECT
    usuarios.id,
    usuarios.nombre_usuario,
    usuarios.correo,
    roles.nombre AS rol
FROM usuarios
INNER JOIN roles
ON usuarios.rol_id = roles.id;

-- Ver detalles de columnas en la tabla usuarios
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'usuarios';

-- Ver estructura de la tabla usuarios ordenada por posición
SELECT
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

-- Ver todos los usuarios
SELECT * FROM usuarios;

-- Obtener contraseñas (hash)
SELECT "contraseña" FROM usuarios;

-- Obtener columnas seleccionadas de usuarios
SELECT id, nombre_usuario, rut, correo, rol_id FROM usuarios;

-- Consultas de reportes
SELECT * FROM reportes LIMIT 1;
SELECT * FROM reportes ORDER BY id DESC;

-- Elevar un usuario registrado a Administrador (Modificar id según corresponda)
-- UPDATE usuarios
-- SET rol_id = 1
-- WHERE id = 7;

-- Consultas de otras tablas
SELECT * FROM cursos;
SELECT * FROM evaluaciones;
SELECT * FROM alertas;
