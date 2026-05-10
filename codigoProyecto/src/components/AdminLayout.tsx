import React from 'react';

import {
  IonIcon,
  IonButton
} from '@ionic/react';

import {
  homeOutline,
  schoolOutline,
  clipboardOutline,
  shieldCheckmarkOutline,
  warningOutline,
  timeOutline,
  documentTextOutline,
  statsChartOutline,
  calendarOutline,
  peopleOutline,
  logOutOutline,
  personOutline
} from 'ionicons/icons';

import { useLocation, useHistory } from 'react-router-dom';

import './AdminLayout.css';

interface Props {
  children: React.ReactNode;
}

const menuItems = [
  { title: 'Dashboard', path: '/DashBoardAdmin', icon: homeOutline },
  { title: 'Capacitación', path: '/Capacitacion', icon: schoolOutline },
  { title: 'Evaluación', path: '/Evaluacion', icon: clipboardOutline },
  { title: 'Validador de Dominios', path: '/ValidadorDominios', icon: shieldCheckmarkOutline },
  { title: 'Reportar Incidente', path: '/ReportarIncidente', icon: warningOutline },
  { title: 'Historial de Reportes', path: '/HistorialReportes', icon: timeOutline },
  { title: 'Validador de Documentos', path: '/ValidadorDocumentos', icon: documentTextOutline },
  { title: 'Estadísticas', path: '/Estadisticas', icon: statsChartOutline },
  { title: 'Agenda', path: '/Agenda', icon: calendarOutline },
  { title: 'Gestión de Usuarios', path: '/GestionUsuarios', icon: peopleOutline }
];

const AdminLayout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const history = useHistory();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    history.push('/Login');
  };

  return (
    <div className="admin-shell">

      <aside className="sidebar">
        <div className="sidebar-title">
          <h2>CiberSeguridad<br />Municipal</h2>
          <p>Protección Digital</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={
                location.pathname === item.path
                  ? 'sidebar-link active'
                  : 'sidebar-link'
              }
              onClick={() => history.push(item.path)}
            >
              <IonIcon icon={item.icon} />
              <span>{item.title}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          Ley 19.628 - Protección de Datos
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="brand">
            <div className="brand-icon">
              <IonIcon icon={shieldCheckmarkOutline} />
            </div>

            <div>
              <h3>Municipalidad de Chile</h3>
              <p>Plataforma de Ciberseguridad</p>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="admin-pill">
              <IonIcon icon={personOutline} />
              <span>Admin</span>
            </div>

            <IonButton fill="clear" className="logout" onClick={cerrarSesion}>
              <IonIcon icon={logOutOutline} slot="start" />
              Cerrar Sesión
            </IonButton>
          </div>
        </header>

        <div className="admin-page">
          {children}
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;