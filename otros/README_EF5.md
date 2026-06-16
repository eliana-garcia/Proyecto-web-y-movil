# Integración con Servicio Externo (EF 5)

Este documento detalla la implementación de la integración con un servicio externo mediante una API de terceros, cumpliendo con el requerimiento **EF 5**.

## Servicio Utilizado
Se ha integrado la API de **[mindicador.cl](https://mindicador.cl/)**, un servicio público que entrega los principales indicadores económicos para Chile en tiempo real (UF, Dólar, Euro, UTM).

## Cambios Realizados

### 1. Backend (Servidor)
Se ha modificado el archivo `servidor/server.js` para incluir un nuevo endpoint protegido:

- **Endpoint**: `GET /api/indicadores`
- **Lógica**: Utiliza la API nativa de Node.js `fetch` para realizar una petición asíncrona a `https://mindicador.cl/api`.
- **Seguridad**: El endpoint requiere un token JWT válido (middleware `verificarToken`), asegurando que solo usuarios autenticados puedan consultar estos datos.
- **Respuesta**: Retorna un objeto JSON con los valores actuales de la UF, Dólar, Euro y UTM.

### 2. Frontend (Aplicación Web/Móvil)
Se ha actualizado el componente del Dashboard Administrativo en `codigoProyecto/src/pages/DashBoardAdmin.tsx`:

- **Estado**: Se añadió un nuevo estado `indicadores` para almacenar los datos obtenidos de la API.
- **Efecto Asíncrono**: Se modificó el hook `useEffect` para realizar la petición al backend (`/api/indicadores`) al cargar el dashboard.
- **Interfaz de Usuario (UI)**: Se insertó una nueva sección visual debajo de las estadísticas principales. Esta sección muestra tarjetas informativas con los valores actualizados de los indicadores económicos, formateados según la moneda local ($).

## Propósito de la Integración
Dado que el proyecto está enfocado en la gestión de seguridad y reportes para funcionarios municipales, contar con indicadores económicos actualizados en el panel principal aporta un valor agregado informativo para la toma de decisiones financieras o administrativas sin salir de la plataforma.

## Verificación
Para verificar el funcionamiento:
1. Iniciar el servidor backend.
2. Iniciar la aplicación frontend.
3. Iniciar sesión como administrador o funcionario.
4. Observar la nueva sección "Indicadores Económicos" en el Dashboard.
