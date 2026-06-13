## Plataforma de Ciberseguridad Municipal

## Descripción

Plataforma web y móvil desarrollada para municipios de Chile, enfocada en fortalecer la ciberseguridad institucional y proteger datos personales. El proyecto está alineado con la Ley 21.663 (Marco de Ciberseguridad) y la Ley 21.180 (Transformación Digital del Estado).

---

## Integrantes

* Kevin Alvarez
* Mario Rojas
* Jose Mena
* Eliana García

---

## Diseño UI/UX

El prototipo interactivo está disponible en Figma:

* **Versión Web :** [Acceder al Prototipo Web](https://www.figma.com/proto/SJBMvQYMxzBbBbfmXl0ocW/Mockups?node-id=29-1400&t=1FDYhFvk8TWHh93G-1&scaling=scale-down&content-scaling=fixed&page-id=3%3A2&starting-point-node-id=29%3A1400)
* **Versión Móvil :** [Acceder al Prototipo Móvil](https://www.figma.com/proto/SJBMvQYMxzBbBbfmXl0ocW/Mockups?node-id=64-6&t=4tQ8VzTfo9pqKYsI-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1)
---

## Estructura del Proyecto

```text
Proyecto-web-y-movil-main/
│
├── codigoProyecto/     # Frontend React + Ionic
├── servidor/           # Backend Node.js + Express
├── otros/              # Documentación complementaria
│   └── 2.7/            # Evidencias del proyecto
├── README.md
└── .gitignore
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

### Base de Datos
* PostgreSQL

### Herramientas
* Visual Studio Code
* GitHub
* Windows y Linux

---

## Funcionalidades Recientes

### 🔒 Control de Acceso Basado en Roles (RBAC)
Se ha implementado un sistema de roles para asegurar que cada funcionario acceda solo a las herramientas que le corresponden:
* **Administradores:** Acceso total a la plataforma, incluyendo la **Gestión de Usuarios** y **Gestión de Reportes**.
* **Funcionarios:** Acceso a herramientas de capacitación, evaluación y reporte, con restricción automática a las funciones administrativas.

### 🛡️ Seguridad y Rutas Protegidas
* **Navegación Dinámica:** El menú lateral se adapta automáticamente según el rol del usuario, ocultando opciones no autorizadas.
* **Middleware de Frontend:** Las rutas críticas están protegidas a nivel de código; si un usuario intenta acceder manualmente a una URL de administración, el sistema lo redirige al panel de capacitación.

### 🎨 Mejoras en la Experiencia de Usuario (UX)
* **Dashboard Personalizado:** Saludo dinámico que reconoce el nombre y rol del usuario logueado.
* **Formulario de Reportes Optimizado:** Mejora visual en el formulario de incidentes con alineación precisa de campos y diseño responsivo adaptado a la web municipal.

---

## Instalación y Ejecución

### Frontend

Ingresar a la carpeta del proyecto:

```bash
cd codigoProyecto
```

Instalar dependencias:

```bash
npm install
```

Ejecutar la aplicación:

```bash
ionic serve
```

La aplicación se abrirá automáticamente en el navegador.

---

### Backend

Ingresar a la carpeta del servidor:

```bash
cd servidor
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el servidor:

```bash
node server.js
```

Si el servidor inicia correctamente aparecerá:

```text
Servidor iniciado en http://localhost:3000
```

Para verificar el funcionamiento, abrir en el navegador:

```text
http://localhost:3000
```

Respuesta esperada:

```text
Servidor funcionando
```
## Configuración del entorno

Importante: Cada integrante debe crear su propio archivo `.env` tomando como referencia `.env.example`.

Asegúrate de completar correctamente las variables de entorno, especialmente:

- DB_HOST
- DB_PORT
- DB_USER
- DB_PASS
- DB_NAME
- JWT_SECRET

Reemplaza `DB_PASS` por la contraseña de tu instalación local de PostgreSQL.
---

## Documentación Complementaria

La carpeta **otros/** contiene la documentación técnica y archivos de respaldo utilizados durante el desarrollo del proyecto.

### Contenido

* Entrega Parcial 1.pdf
* Entrega Parcial 2.pdf
* web.sql
* Carpeta 2.7 con evidencias de implementación y funcionamiento

---

## Evidencias

La carpeta **otros/2.7/** contiene:

* Capturas de pantalla del sistema.
* Evidencias de ejecución.
* Validaciones de funcionalidades.
* Pruebas realizadas durante el desarrollo.
* Material de respaldo para la evaluación del proyecto.

---

## Repositorio

Repositorio oficial del proyecto:

https://github.com/eliana-garcia/Proyecto-web-y-movil
