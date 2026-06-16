const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const xss = require("xss");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const pool = require("./db");

dotenv.config();

const app = express();

/* ========================================================
   1. CONFIGURACIÓN DE SEGURIDAD Y OPTIMIZACIÓN
   ======================================================== */

// Helmet para cabeceras HTTP seguras (Ajustado para desarrollo local y Docker)
app.use(helmet({
  contentSecurityPolicy: false, 
  crossOriginResourcePolicy: { policy: "cross-origin" } 
}));

// Compresión de respuestas para optimización (EF 4)
app.use(compression());

// Configuración segura de CORS (EF 3)
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173'];

// Forzar que el puerto 8100 de Ionic siempre esté permitido localmente si no viene en el .env
if (!allowedOrigins.includes('http://localhost:8100')) {
  allowedOrigins.push('http://localhost:8100');
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'La política de CORS para este sitio no permite el acceso desde el origen especificado.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rate Limiting para prevenir fuerza bruta (EF 3)
const limiteGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: { mensaje: "Demasiadas peticiones desde esta IP, por favor intente más tarde." }
});

const limiteLoginRegistro = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 100, 
  message: { mensaje: "Demasiados intentos de acceso, por favor intente en una hora." }
});

// Middleware de sanitización contra XSS (EF 3)
const sanitizarEntrada = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') req.body[key] = xss(req.body[key]);
    }
  }
  if (req.params) {
    for (let key in req.params) {
      if (typeof req.params[key] === 'string') req.params[key] = xss(req.params[key]);
    }
  }
  if (req.query) {
    for (let key in req.query) {
      if (typeof req.query[key] === 'string') req.query[key] = xss(req.query[key]);
    }
  }
  next();
};

app.use(sanitizarEntrada);

// Aplicamos el límite general a todas las llamadas de la API
app.use("/api/", limiteGeneral);


/* ========================================================
   2. MIDDLEWARES DE AUTENTICACIÓN Y AUTORIZACIÓN
   ======================================================== */

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.log("ERROR JWT:", error.message);
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};

const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 1) {
    return res.status(403).json({ mensaje: "Acceso solo para administradores" });
  }
  next();
};


/* ========================================================
   3. RUTAS DEL SISTEMA
   ======================================================== */

app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor funcionando de forma segura" });
});

app.get("/test-db", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error de conexión" });
  }
});

/* --- REGISTRO --- */
app.post("/api/registro", limiteLoginRegistro, async (req, res) => {
  try {
    const { nombre_usuario, rut, correo, region, comuna, password } = req.body;
    
    if (!nombre_usuario || !rut || !correo || !region || !comuna || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ mensaje: "Correo electrónico inválido" });
    }

    if (password.length < 8) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 8 caracteres" });
    }

    const rutLimpio = rut.replace(/\./g, "");
    const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;
    if (!rutRegex.test(rutLimpio)) {
      return res.status(400).json({ mensaje: "Formato de RUT inválido" });
    }

    const usuarioExiste = await pool.query("SELECT * FROM usuarios WHERE rut = $1", [rutLimpio]);
    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO usuarios 
      (nombre_usuario, rut, correo, region, comuna, "contraseña", rol_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [nombre_usuario, rutLimpio, correo, region, comuna, passwordHash, 2]
    );

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("ERROR REGISTRO:", error);
    res.status(500).json({ mensaje: "Error al registrar usuario", error: error.message });
  }
});

/* --- LOGIN --- */
app.post("/api/login", limiteLoginRegistro, async (req, res) => {
  try {
    const { rut, password } = req.body;

    if (!rut || !password) {
      return res.status(400).json({ mensaje: "RUT y contraseña son obligatorios" });
    }

    const rutLimpio = rut.replace(/\./g, "");
    const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;
    if (!rutRegex.test(rutLimpio)) {
      return res.status(400).json({ mensaje: "Formato de RUT inválido" });
    }

    const resultado = await pool.query(
      "SELECT id, nombre_usuario, rut, correo, region, comuna, contraseña AS password, rol_id FROM usuarios WHERE rut = $1", 
      [rutLimpio]
    );
    if (resultado.rows.length === 0) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = resultado.rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol_id, rut: usuario.rut },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      id: usuario.id,
      rol: usuario.rol_id,
      nombre: usuario.nombre_usuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
});

/* --- GESTIÓN DE USUARIOS (ADMIN) --- */
app.get("/api/usuarios", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const resultado = await pool.query(
      `SELECT id, nombre_usuario, rut, correo, region, comuna, rol_id FROM usuarios ORDER BY id LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
});

app.get("/api/usuarios/:id", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      `SELECT id, nombre_usuario, correo, region, comuna FROM usuarios WHERE id = $1`, [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
});

app.put("/api/usuarios/:id", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, correo, region, comuna } = req.body;

    const resultado = await pool.query(
      `UPDATE usuarios 
       SET nombre_usuario = $1, correo = $2, region = $3, comuna = $4 
       WHERE id = $5 
       RETURNING id, nombre_usuario, correo, region, comuna, rol_id`,
      [nombre_usuario, correo, region, comuna, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
});

app.delete("/api/usuarios/:id", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(`DELETE FROM usuarios WHERE id = $1 RETURNING id`, [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
});

/* --- PERFIL PROTEGIDO --- */
app.get("/api/perfil", verificarToken, async (req, res) => {
  res.json({ mensaje: "Acceso autorizado", usuario: req.usuario });
});

/* --- REPORTES --- */
app.post("/api/reportes", verificarToken, async (req, res) => {
  try {
    const { descripcion } = req.body;
    if (!descripcion || descripcion.trim() === "") {
      return res.status(400).json({ mensaje: "La descripción es obligatoria" });
    }
    const usuario_id = req.usuario.id;

    await pool.query(
      `INSERT INTO reportes (usuario_id, descripcion, evidencia, estado) VALUES ($1, $2, $3, $4)`,
      [usuario_id, descripcion, '', 'Pendiente']
    );
    res.status(201).json({ mensaje: 'Reporte creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear reporte' });
  }
});

app.get("/api/reportes", verificarToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    let query = `SELECT id, usuario_id, descripcion, estado, fecha_creacion as fecha, 'Seguridad' as tipo 
                 FROM reportes`;
    let params = [];

    // Restringir a funcionarios para que solo vean sus propios reportes
    if (req.usuario.rol !== 1) {
      query += ` WHERE usuario_id = $1`;
      params.push(req.usuario.id);
    }

    query += ` ORDER BY id DESC`;

    // Agregar paginación
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const resultado = await pool.query(query, params);
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener reportes" });
  }
});

app.get("/api/reportes/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(`SELECT * FROM reportes WHERE id = $1`, [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Reporte no encontrado" });
    }
    const reporte = resultado.rows[0];

    // Impedir que un usuario vea reportes de otros usuarios (IDOR)
    if (req.usuario.rol !== 1 && reporte.usuario_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: "Acceso no autorizado a este reporte" });
    }

    res.json(reporte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener reporte" });
  }
});

app.put("/api/reportes/:id", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const resultado = await pool.query(
      `UPDATE reportes SET estado = $1 WHERE id = $2 RETURNING *`, [estado, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Reporte no encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar reporte" });
  }
});

app.delete("/api/reportes/:id", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(`DELETE FROM reportes WHERE id = $1 RETURNING id`, [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Reporte no encontrado" });
    }
    res.json({ mensaje: "Reporte eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar reporte" });
  }
});

/* --- EVALUACIONES, ALERTAS Y CURSOS --- */
app.get("/api/evaluaciones", verificarToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const resultado = await pool.query(
      `SELECT * FROM evaluaciones ORDER BY id LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener evaluaciones" });
  }
});

app.get("/api/alertas", verificarToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const resultado = await pool.query(
      `SELECT * FROM alertas ORDER BY fecha_publicacion DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener alertas" });
  }
});

app.get("/api/cursos", verificarToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const resultado = await pool.query(
      `SELECT * FROM cursos ORDER BY id LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener cursos" });
  }
});

/* --- INDICADORES ECONÓMICOS EXTERNOS (EF 5) --- */
app.get("/api/indicadores", verificarToken, async (req, res) => {
  try {
    const response = await fetch("https://mindicador.cl/api");
    if (!response.ok) {
      throw new Error(`Error de mindicador.cl: ${response.status}`);
    }
    const data = await response.json();
    res.json({
      uf: data.uf,
      dolar: data.dolar,
      euro: data.euro,
      utm: data.utm
    });
  } catch (error) {
    console.error("ERROR INDICADORES:", error.message);
    res.status(500).json({ mensaje: "Error al obtener indicadores económicos externos" });
  }
});

/* ========================================================
   4. INICIALIZACIÓN DEL SERVIDOR
   ======================================================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor seguro corriendo en el puerto ${PORT}`);
});
