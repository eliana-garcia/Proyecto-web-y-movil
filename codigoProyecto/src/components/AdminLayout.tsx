import React, { useState } from 'react';

import {
  IonIcon,
  IonButton,
  IonContent
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
  personOutline,
  alertCircleOutline,
  menuOutline,
  closeOutline
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
  { title: 'Gestión de Usuarios', path: '/GestionUsuarios', icon: peopleOutline, adminOnly: true },
  { title: 'Gestión de Reportes', path: '/GestionReportes', icon: alertCircleOutline, adminOnly: true }
];

const AdminLayout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const history = useHistory();
  const [menuOpen, setMenuOpen] = useState(false);

  // Obtener información del usuario desde localStorage
  const userStr = localStorage.getItem('usuario');
  const user = userStr ? JSON.parse(userStr) : null;
  const rol = localStorage.getItem('rol');
  const isAdmin = rol === '1';

  const visibleMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  const cerrarSesion = () => {
    localStorage.clear();
    history.push('/Login');
  };

  const handleMenuClick = (path: string) => {
    setMenuOpen(false);
    history.push(path);
  };

  return (
    <div className="admin-shell">
      {/* Mobile overlay */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)}></div>
      )}

      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-title">
          <div className="sidebar-title-content">
            <h2>CiberSeguridad<br />Municipal</h2>
            <p>Protección Digital</p>
          </div>
          <button className="mobile-close-btn" onClick={() => setMenuOpen(false)}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {visibleMenuItems.map((item) => (
            <button
              key={item.path}
              className={
                location.pathname === item.path
                  ? 'sidebar-link active'
                  : 'sidebar-link'
              }
              onClick={() => handleMenuClick(item.path)}
            >
              <IonIcon icon={item.icon} />
              <span className="sidebar-text">{item.title}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-text">Ley 19.628 - Protección de Datos</span>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="brand">
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)}>
              <IonIcon icon={menuOutline} />
            </button>
            <div className="brand-icon hide-mobile">
              <IonIcon icon={shieldCheckmarkOutline} />
            </div>

            <div>
              <h3>Municipalidad de Chile</h3>
              <p className="hide-mobile">Plataforma de Ciberseguridad</p>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="admin-pill hide-mobile">
              <IonIcon icon={personOutline} />
              <span>{user?.nombre_usuario || user?.nombre || (isAdmin ? 'Administrador' : 'Funcionario')}</span>
            </div>

            <IonButton fill="clear" className="logout" onClick={cerrarSesion}>
              <IonIcon icon={logOutOutline} slot="start" />
              <span className="hide-mobile">Cerrar Sesión</span>
            </IonButton>
          </div>
        </header>

        <IonContent className="ion-padding-custom">
          <div className="admin-page">
            {children}
          </div>
        </IonContent>
      </main>

    </div>
  );
};

export default AdminLayout;