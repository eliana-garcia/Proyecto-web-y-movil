



-- =========================================
-- TABLA ROLES
-- =========================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- =========================================
-- TABLA USUARIOS
-- =========================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,

    nombre_usuario VARCHAR(100) NOT NULL,

    rut VARCHAR(12) UNIQUE NOT NULL,

    correo VARCHAR(100) UNIQUE NOT NULL,

    region VARCHAR(100) NOT NULL,

    comuna VARCHAR(100) NOT NULL,

    contraseña VARCHAR(255) NOT NULL,

    rol_id INT NOT NULL,

    CONSTRAINT fk_rol
    FOREIGN KEY (rol_id)
    REFERENCES roles(id)
);

-- =========================================
-- TABLA CURSOS
-- =========================================

CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,

    titulo VARCHAR(100) NOT NULL,

    descripcion TEXT NOT NULL
);

-- =========================================
-- TABLA EVALUACIONES
-- =========================================

CREATE TABLE evaluaciones (
    id SERIAL PRIMARY KEY,

    curso_id INT NOT NULL,

    puntaje INT NOT NULL,

    CONSTRAINT fk_curso
    FOREIGN KEY (curso_id)
    REFERENCES cursos(id)
);

-- =========================================
-- TABLA REPORTES
-- =========================================

CREATE TABLE reportes (
    id SERIAL PRIMARY KEY,

    usuario_id INT NOT NULL,

    descripcion TEXT NOT NULL,

    evidencia TEXT,

    estado VARCHAR(50) NOT NULL,

    CONSTRAINT fk_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
);

-- =========================================
-- TABLA ALERTAS
-- =========================================

CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,

    titulo VARCHAR(100) NOT NULL,

    contenido TEXT NOT NULL,

    fecha_publicacion TIMESTAMP NOT NULL
);


SELECT * FROM roles;

SELECT * FROM usuarios LIMIT 1;

SELECT
    usuarios.id,
    usuarios.nombre_usuario,
    usuarios.correo,
    roles.nombre AS rol
FROM usuarios
INNER JOIN roles
ON usuarios.rol_id = roles.id;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'usuarios';


SELECT
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;


SELECT *
FROM roles;

SELECT * FROM roles;
SELECT * FROM usuarios;
INSERT INTO roles (nombre)
VALUES
('ADMIN'),
('USUARIO');
SELECT * FROM roles;

SELECT id, nombre_usuario, rut, correo, rol_id
FROM usuarios;

SELECT "contraseña"
FROM usuarios;

SELECT id, nombre_usuario, rut, correo, rol_id
FROM usuarios;

SELECT *
FROM usuarios
LIMIT 1;

SELECT *
FROM reportes
LIMIT 1;

SELECT *
FROM reportes
ORDER BY id DESC;

SELECT id, nombre_usuario, rut, correo, rol_id
FROM usuarios;

UPDATE usuarios
SET rol_id = 1
WHERE id = 7;