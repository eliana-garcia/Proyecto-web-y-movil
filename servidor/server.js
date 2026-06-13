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

// --- CONFIGURACIÓN DE SEGURIDAD Y OPTIMIZACIÓN ---

// 1. Helmet para cabeceras HTTP seguras
app.use(helmet());

// 2. Compresión de respuestas para optimización (EF 4)
app.use(compression());

// 3. Configuración segura de CORS (EF 3)
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (como apps móviles o curl)
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

// 4. Rate Limiting para prevenir fuerza bruta (EF 3)
const limiteGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por IP
  message: { mensaje: "Demasiadas peticiones desde esta IP, por favor intente más tarde." }
});

const limiteLoginRegistro = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Máximo 10 intentos
  message: { mensaje: "Demasiados intentos de acceso, por favor intente en una hora." }
});

// 5. Middleware de sanitización contra XSS (EF 3)
const sanitizarEntrada = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  if (req.params) {
    for (let key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = xss(req.params[key]);
      }
    }
  }
  if (req.query) {
    for (let key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key]);
      }
    }
  }
  next();
};

app.use(sanitizarEntrada);
app.use("/api/", limiteGeneral);

/* =========================
  MIDDLEWARE JWT