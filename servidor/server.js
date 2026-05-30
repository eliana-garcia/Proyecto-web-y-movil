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

const PORT = process.env.PORT || 3000;
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
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});