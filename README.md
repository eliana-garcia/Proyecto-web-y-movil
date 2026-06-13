# Plataforma de Ciberseguridad Municipal

## Descripción

Plataforma web y móvil desarrollada para municipios de Chile, enfocada en fortalecer la ciberseguridad institucional y proteger datos personales. El proyecto está alineado con la Ley 21.663 (Marco de Ciberseguridad) y la Ley 21.180 (Transformación Digital del Estado).

---

## Integrantes

* Kevin Alvarez
* Mario Rojas
* Jose Mena
* Eliana García

---

## Estructura Organizada del Proyecto

El proyecto ha sido reorganizado para una mejor legibilidad y mantenimiento:

```text
Proyecto-web-y-movil-main/
│
├── codigoProyecto/      # Frontend React + Ionic (Aplicación Web y Móvil)
├── servidor/            # Backend Node.js + Express (API REST)
├── base_de_datos/       # Scripts SQL y respaldo de la base de datos
│   └── web.sql          # Script de creación de tablas y datos iniciales
├── documentacion/       # Documentos técnicos y evidencias
│   ├── pruebas_funcionales/  # Capturas y reportes de pruebas
│   ├── README_EF5.md    # Detalle de la integración con API externa (EF 5)
│   ├── Entrega Parcial 1.pdf
│   └── Entrega Parcial 2.pdf
├── README.md            # Guía principal del proyecto
└── .gitignore           # Archivos ignorados por Git
```

---

## Tecnologías Utilizadas

### Frontend
* React 19
* Ionic Framework 8.5.0
* Vite (Build tool)
* TypeScript

### Backend
* Node.js
* Express
* JWT (Autenticación)

### Base de Datos
* PostgreSQL

---

## Funcionalidades Destacadas

### 1. Integración con API Externa (EF 5)
Se ha integrado la API de **mindicador.cl** para mostrar indicadores económicos reales (UF, Dólar, Euro, UTM) directamente en el Dashboard Administrativo. Los detalles técnicos se encuentran en `documentacion/README_EF5.md`.

### 2. Control de Acceso (RBAC)
* **Administradores:** Gestión total de usuarios y reportes.
* **Funcionarios:** Acceso a capacitación y reportes de incidentes.

### 3. Seguridad
* Encriptación de contraseñas con bcrypt.
* Protección de rutas en el frontend mediante validación de tokens JWT.
* Sanitización de entradas y límites de peticiones (Rate Limiting).

---

## Guía de Inicio Rápido

### Backend (Servidor)
1. Entrar a `servidor/`.
2. Ejecutar `npm install`.
3. Configurar el archivo `.env` (usar `.env.example` como base).
4. Iniciar con `node server.js` o `npx nodemon server.js`.

### Frontend (App)
1. Entrar a `codigoProyecto/`.
2. Ejecutar `npm install`.
3. Iniciar el modo desarrollo con `npm run dev`.
4. Acceder a `http://localhost:5173`.

---

## Diseño UI/UX

* **Versión Web:** [Figma Web](https://www.figma.com/proto/SJBMvQYMxzBbBbfmXl0ocW/Mockups?node-id=29-1400&t=1FDYhFvk8TWHh93G-1&scaling=scale-down&content-scaling=fixed&page-id=3%3A2&starting-point-node-id=29%3A1400)
* **Versión Móvil:** [Figma Móvil](https://www.figma.com/proto/SJBMvQYMxzBbBbfmXl0ocW/Mockups?node-id=64-6&t=4tQ8VzTfo9pqKYsI-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1)
