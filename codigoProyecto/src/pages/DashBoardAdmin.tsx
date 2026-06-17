import React, { useEffect, useState } from 'react';
import { IonPage, IonIcon } from '@ionic/react';
import { API_URL, apiFetch } from '../services/api';
import {
  warningOutline,
  shieldCheckmarkOutline,
  ribbonOutline,
  trendingUpOutline,
  homeOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const DashBoardAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState(0);
  const [reportes, setReportes] = useState(0);
  const [reportesActivos, setReportesActivos] = useState(0);
  const [indicadores, setIndicadores] = useState<any>(null);

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('usuario');
    const role = localStorage.getItem('rol');
    let isUserAdmin = false;

    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    if (role === '1') {
      isUserAdmin = true;
      setIsAdmin(true);
    }

    const cargarDatos = async () => {
      try {
        // 1. Cargar reportes
        const dataReportes = await apiFetch("/api/reportes");
        const listReportes = Array.isArray(dataReportes) ? dataReportes : [];
        setReportes(listReportes.length);
        const activos = listReportes.filter((r: any) => r.estado !== 'Resuelto').length;
        setReportesActivos(activos);

        // 2. Cargar usuarios (solo administradores)
        if (isUserAdmin) {
          const dataUsuarios = await apiFetch("/api/usuarios");
          setUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios.length : 0);
        }

        // 3. Cargar indicadores económicos (EF 5)
        const dataIndicadores = await apiFetch("/api/indicadores");
        setIndicadores(dataIndicadores);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      }
    };

    cargarDatos();
  }, []);
  return (
    <IonPage>
      <AdminLayout>
        <section className="alert-card">
          <IonIcon icon={warningOutline} />
          <div>
            <h2>Alerta de Seguridad Crítica</h2>
            <p>
              Nueva campaña de phishing detectada dirigida a funcionarios municipales.
              Evitar hacer clic en enlaces de correos que soliciten actualizar
              credenciales o información personal.
            </p>
            <span>Publicado: 01/05/2026 - Administrador de Seguridad</span>
          </div>
        </section>

        <section className="hero-card">
          <div>
            <h1>Hola, {user?.nombre_usuario || user?.nombre || (isAdmin ? 'Administrador' : 'Funcionario')}</h1>
            <p>
              {isAdmin ? 'Gestión de Seguridad' : 'Protección Digital'} <strong>Óptima</strong>
            </p>
            <span>
              <IonIcon icon={homeOutline} /> {isAdmin ? 'Panel de Administración' : 'Panel de Funcionario'}    
            </span>
          </div>
          <div className="hero-icon">
            <IonIcon icon={isAdmin ? shieldCheckmarkOutline : ribbonOutline} />
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <IonIcon icon={ribbonOutline} className="green-circle" />
            <h2>{usuarios}</h2>
            <p>Usuarios Registrados</p>
            <small>Total de funcionarios</small>
            <div className="progress orange">
              <span style={{ width: '45%' }}></span>
            </div>
          </div>
          <div className="stat-card">
            <IonIcon icon={warningOutline} className="orange-circle" />
            <h2 className="orange-text">{reportesActivos}</h2>
            <p>Reportes Activos</p>
            <small> Total de reportes: {reportes}</small>
            <div className="progress orange">
              <span style={{ width: '45%' }}></span>
            </div>
          </div>
          <div className="stat-card">
            <IonIcon icon={trendingUpOutline} className="blue-circle" />
            <h2 className="blue-text"> {reportes}</h2>
            <p>Reportes Totales</p>
            <small> Historial acumulado </small>
            <strong className="success"> Datos en tiempo real </strong>
          </div>
        </section>

        <section className="panel">
          <h2>Incidentes - Últimos 5 Meses</h2>
          <div className="fake-chart">
            <div></div><div></div><div></div><div className="high"></div><div></div>
          </div>
        </section>

        {/* Sección de Indicadores Económicos (EF 5) */}
        <section className="panel" style={{ marginTop: '20px' }}>
          <h2>Indicadores Económicos</h2>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div className="stat-card" style={{ padding: '15px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>UF</p>
              <h3 style={{ margin: '5px 0' }}>{indicadores?.uf?.valor ? `$${indicadores.uf.valor.toLocaleString('es-CL')}` : 'Cargando...'}</h3>
            </div>
            <div className="stat-card" style={{ padding: '15px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Dólar</p>
              <h3 style={{ margin: '5px 0' }}>{indicadores?.dolar?.valor ? `$${indicadores.dolar.valor.toLocaleString('es-CL')}` : 'Cargando...'}</h3>
            </div>
            <div className="stat-card" style={{ padding: '15px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Euro</p>
              <h3 style={{ margin: '5px 0' }}>{indicadores?.euro?.valor ? `$${indicadores.euro.valor.toLocaleString('es-CL')}` : 'Cargando...'}</h3>
            </div>
            <div className="stat-card" style={{ padding: '15px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>UTM</p>
              <h3 style={{ margin: '5px 0' }}>{indicadores?.utm?.valor ? `$${indicadores.utm.valor.toLocaleString('es-CL')}` : 'Cargando...'}</h3>
            </div>
          </div>
        </section>
      </AdminLayout>
    </IonPage>
  );
};

export default DashBoardAdmin;
