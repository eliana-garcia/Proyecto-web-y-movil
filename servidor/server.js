const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MIDDLEWARE JWT
========================= */

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensaje: "Token requerido"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      mensaje: "Token requerido"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = decoded;

    next();

  } catch (error) {
    return res.status(403).json({
      mensaje: "Token inválido"
    });
  }
};

/* =========================
   RUTAS DE PRUEBA
========================= */

app.get("/", (req, res) => {
  res.json({
    mensaje: "Servidor funcionando"
  });
});

app.get("/test-db", async (req, res) => {
  try {

    const resultado = await pool.query(
      "SELECT NOW()"
    );

    res.json(resultado.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error de conexión"
    });
  }
});

/* =========================
   REGISTRO
========================= */

app.post("/api/registro", async (req, res) => {
  try {

    const {
      nombre_usuario,
      rut,
      correo,
      region,
      comuna,
      password
    } = req.body;

    const usuarioExiste = await pool.query(
      "SELECT * FROM usuarios WHERE rut = $1",
      [rut]
    );

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({
        mensaje: "El usuario ya existe"
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    await pool.query(
      `INSERT INTO usuarios
      (
        nombre_usuario,
        rut,
        correo,
        region,
        comuna,
        "contraseña",
        rol_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        nombre_usuario,
        rut,
        correo,
        region,
        comuna,
        passwordHash,
        2
      ]
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente"
    });

  } catch (error) {

    console.error("ERROR REGISTRO:");
    console.error(error);

    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message
    });
  }
});

/* =========================
   LOGIN
========================= */

app.post("/api/login", async (req, res) => {
  try {

    const {
      rut,
      password
    } = req.body;

    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE rut = $1",
      [rut]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario no encontrado"
      });
    }

    const usuario = resultado.rows[0];

    const passwordValida =
      await bcrypt.compare(
        password,
        usuario.contraseña
      );

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol_id,
        rut: usuario.rut
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

        res.json({
          token,
          id: usuario.id,
          rol: usuario.rol_id,
          nombre: usuario.nombre_usuario
        });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al iniciar sesión"
    });
  }
});

/* =========================
   LISTAR USUARIOS
========================= */

app.get(
  "/api/usuarios",
  verificarToken,
  async (req, res) => {
    try {

      const resultado = await pool.query(
        `SELECT
          id,
          nombre_usuario,
          rut,
          correo,
          region,
          comuna,
          rol_id
        FROM usuarios
        ORDER BY id`
      );

      res.json(resultado.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        mensaje: "Error al obtener usuarios"
      });
    }
  }
);

/* =========================
   EJEMPLO RUTA PROTEGIDA
========================= */

app.get(
  "/api/perfil",
  verificarToken,
  async (req, res) => {

    res.json({
      mensaje: "Acceso autorizado",
      usuario: req.usuario
    });
  }
);

/* =========================
   SERVIDOR
========================= */

const PORT = process.env.PORT || 3000;

/* =========================
   CREAR REPORTE
========================= */

app.post(
  "/api/reportes",
  verificarToken,
  async (req, res) => {

    try {

      const { descripcion } = req.body;

      const usuario_id = req.usuario.id;

      await pool.query(
        `INSERT INTO reportes
        (
          usuario_id,
          descripcion,
          evidencia,
          estado
        )
        VALUES ($1,$2,$3,$4)`,
        [
          usuario_id,
          descripcion,
          '',
          'Pendiente'
        ]
      );

      res.status(201).json({
        mensaje: 'Reporte creado correctamente'
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        mensaje: 'Error al crear reporte'
      });
    }
  }
);

/* =========================
   LISTAR REPORTES
========================= */

app.get(
  "/api/reportes",
  verificarToken,
  async (req, res) => {

    try {

      const resultado = await pool.query(
        `SELECT
          id,
          usuario_id,
          descripcion,
          estado
        FROM reportes
        ORDER BY id DESC`
      );

      res.json(resultado.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        mensaje: "Error al obtener reportes"
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(
    `Servidor iniciado en puerto ${PORT}`
  );
});