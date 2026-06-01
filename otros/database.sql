
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

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

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

SELECT * FROM usuarios;


SELECT
    usuarios.id,
    usuarios.nombre_usuario,
    usuarios.correo,
    roles.nombre AS rol
FROM usuarios
INNER JOIN roles
ON usuarios.rol_id = roles.id;


