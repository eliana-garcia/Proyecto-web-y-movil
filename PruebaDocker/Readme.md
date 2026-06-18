#  Guía de Instalación y Ejecución del Proyecto 

Sigue estos pasos detallados para configurar el entorno, las variables de entorno y levantar la aplicación utilizando Docker (y comprobar que sirve).

##  1. Requisitos Previos y Configuración

Antes de encender los contenedores, es necesario preparar las herramientas y los archivos de configuración:

1. **Instalar Docker Desktop**: Descárgalo e instálalo desde [Docker Get Started](https://www.docker.com/get-started/).
2. **Crear una cuenta**: Regístrate en Docker Hub e inicia sesión en la aplicación de escritorio.
3. **Descargar el proyecto**: 
   * Descarga el archivo `.zip` desde el repositorio oficial: [Proyecto Web y Móvil](https://github.com/eliana-garcia/Proyecto-web-y-movil).
   * Extrae el contenido del archivo en la carpeta de tu preferencia.

###  Configuración de Variables de Entorno (`.env`)

El proyecto requiere que dejes listas las variables de entorno para que el servidor y la interfaz web se comuniquen correctamente dentro de Docker.

#### A. Servidor (Backend)
1. Entra a la carpeta llamada `servidor`.
2. Verás un archivo de ejemplo llamado `.env.example`. **Crea un archivo nuevo con el nombre exacto `.env`** en esa misma carpeta.
3. El archivo `.env.example` ya viene listo con casi todos los datos correctos por defecto. Sin embargo, **debes asegurarte de modificar la línea del Host de la Base de Datos**. Por defecto viene como `localhost`, pero al usar Docker debes cambiarlo estrictamente a `postgres_db` para que el contenedor del servidor encuentre el contenedor de la base de datos.

## 2. Guía de Ejecución del Proyecto

Sigue estos pasos en orden para levantar el entorno de desarrollo:

### 1. Preparar Docker
* **Abre Docker Desktop** en tu computadora. 
* *Nota:* Solo es necesario que el servicio esté activo en segundo plano; **no es obligatorio mantener la ventana de Docker Desktop abierta** en primer plano (puedes minimizarla).

### 2. Ir a la raíz del proyecto
Abre tu terminal y navega hasta la carpeta raíz del proyecto (donde se encuentra el archivo `docker-compose.yml`):

```bash
cd Proyecto-web-y-movil-main
```
### 3.Usar el siguiente comando
```bash
 docker compose up --build -d
```

### 4. Abrir link
Luego cuando se termine de realizar el proceso anterior debemos ir a nuestro navegador de preferencia y colocar el siguiente link : http://localhost:8100/Login para ver e interactuar con la pagina

## 3. Pruebas de que funciona el docker

Se adjuntara el siguiente link : https://drive.google.com/drive/u/0/folders/1cHtSkQ3wgkGCHnj4m_GWoYq4ymegDweF . Para comprobar que el docker realmente funciona.
