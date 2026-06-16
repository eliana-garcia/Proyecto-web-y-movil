const pool = require('./db');
const bcrypt = require('bcrypt');

const poblarDatos = async () => {
  try {
    console.log('Iniciando poblado de datos de prueba...');
    
    // Hash de la contraseña genérica
    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. INSERTAR USUARIOS (Limpiando tabla primero para evitar duplicados si se corre varias veces)
    // No borramos la tabla completa para no borrar al Admin que creamos antes, solo agregamos nuevos.
    
    const usuariosMock = [
      { nombre: 'María González', rut: '11111111-1', correo: 'maria@municipalidad.cl', region: 'Valparaíso', comuna: 'Viña del Mar', rol: 2 },
      { nombre: 'Carlos Silva', rut: '22222222-2', correo: 'carlos@municipalidad.cl', region: 'Metropolitana', comuna: 'Santiago', rol: 2 },
      { nombre: 'Ana Rojas', rut: '33333333-3', correo: 'ana@municipalidad.cl', region: 'Biobío', comuna: 'Concepción', rol: 2 },
      { nombre: 'Pedro Muñoz', rut: '44444444-4', correo: 'pedro@municipalidad.cl', region: 'Araucanía', comuna: 'Temuco', rol: 2 }
    ];

    console.log('Insertando usuarios...');
    for (const u of usuariosMock) {
      // Verificar si existe
      const existe = await pool.query('SELECT id FROM usuarios WHERE rut = $1', [u.rut.replace(/\./g, '')]);
      if (existe.rows.length === 0) {
        await pool.query(
          `INSERT INTO usuarios (nombre_usuario, rut, correo, region, comuna, contraseña, rol_id) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [u.nombre, u.rut.replace(/\./g, ''), u.correo, u.region, u.comuna, passwordHash, u.rol]
        );
      }
    }

    // Obtener IDs de usuarios para los reportes
    const usuariosResult = await pool.query('SELECT id, nombre_usuario FROM usuarios');
    const usuarios = usuariosResult.rows;

    // 2. INSERTAR REPORTES
    const reportesMock = [
      {
        user: 'María González',
        titulo: 'Correo sospechoso de BancoEstado',
        categoria: 'Phishing o Correo Sospechoso',
        fecha: '15/05/2026',
        estado: 'Resuelto',
        desc: 'Recibí un correo que dice ser de BancoEstado pidiendo que actualice mi clave entrando a un enlace extraño (www.banco-estado-seguro.net).'
      },
      {
        user: 'María González',
        titulo: 'Computador muy lento',
        categoria: 'Infección por Malware / Virus',
        fecha: '10/06/2026',
        estado: 'Pendiente',
        desc: 'Mi computador de escritorio está extremadamente lento desde ayer y aparecen ventanas emergentes de publicidad.'
      },
      {
        user: 'Carlos Silva',
        titulo: 'Intento de acceso a mi cuenta',
        categoria: 'Acceso No Autorizado',
        fecha: '12/06/2026',
        estado: 'En Revisión',
        desc: 'Me llegó una notificación al celular de que alguien intentó entrar a mi correo institucional desde Rusia.'
      },
      {
        user: 'Ana Rojas',
        titulo: 'Archivo bloqueado',
        categoria: 'Infección por Malware / Virus',
        fecha: '01/06/2026',
        estado: 'Resuelto',
        desc: 'Descargué un archivo adjunto y ahora no puedo abrir mis documentos de Excel, dice que están encriptados.'
      },
      {
        user: 'Pedro Muñoz',
        titulo: 'Falla en sistema de pagos',
        categoria: 'Vulnerabilidad en Sistema',
        fecha: '11/06/2026',
        estado: 'Pendiente',
        desc: 'El sistema interno de pagos municipales está mostrando un error de base de datos cuando intento procesar facturas.'
      }
    ];

    console.log('Insertando reportes...');
    for (const r of reportesMock) {
      const user = usuarios.find(u => u.nombre_usuario === r.user);
      if (user) {
        const descripcionCompleta = `
Título: ${r.titulo}

Categoría: ${r.categoria}

Fecha: ${r.fecha}

Descripción:
${r.desc}
`;
        await pool.query(
          `INSERT INTO reportes (usuario_id, descripcion, estado) VALUES ($1, $2, $3)`,
          [user.id, descripcionCompleta, r.estado]
        );
      }
    }

    console.log('¡Datos de prueba insertados con éxito!');
    process.exit(0);

  } catch (error) {
    console.error('Error al insertar datos:', error);
    process.exit(1);
  }
};

poblarDatos();