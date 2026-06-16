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

-- =========================================
-- INSERCIÓN DE DATOS SEMILLA (INICIALES)
-- =========================================
INSERT INTO roles (nombre)
VALUES
('ADMIN'),
('USUARIO')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cursos (titulo, descripcion)
VALUES
('Phishing y Correos Fraudulentos', 'Identificar correos maliciosos y técnicas de phishing'),
('Seguridad de Contraseñas', 'Buenas prácticas para crear y administrar contraseñas seguras'),
('Protección de Datos Personales', 'Medidas para proteger información sensible');

INSERT INTO evaluaciones (curso_id, puntaje)
VALUES
(1, 85),
(2, 90),
(3, 78);

INSERT INTO alertas (titulo, contenido, fecha_publicacion)
VALUES
('Alerta de Phishing', 'Se detectó una campaña de correos fraudulentos.', CURRENT_TIMESTAMP),
('Actualización de Seguridad', 'Actualizar sistemas antes del viernes.', CURRENT_TIMESTAMP),
('Riesgo de Contraseñas Débiles', 'Se recomienda cambiar contraseñas antiguas.', CURRENT_TIMESTAMP);
