import React from 'react';
import { IonPage, IonIcon } from '@ionic/react';

import {
  warningOutline,
  shieldCheckmarkOutline,
  ribbonOutline,
  trendingUpOutline,
  homeOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const DashBoardAdmin: React.FC = () => {
  return (
    <IonPage>
      <AdminLayout>
        <section className="alert-card">
          <IonIcon icon={warningOutline} />
          <div>
            <h2>⚠ Alerta de Seguridad Crítica</h2>
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
            <h1>Hola, Admin</h1>
            <p>
              Protección <strong>Óptima</strong>
            </p>
            <span>
              <IonIcon icon={homeOutline} /> Dashboard
            </span>
          </div>

          <div className="hero-icon">
            <IonIcon icon={shieldCheckmarkOutline} />
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <IonIcon icon={ribbonOutline} className="green-circle" />
            <h2>87%</h2>
            <p>Cursos Completados</p>
            <small>26 de 30 funcionarios</small>
            <div className="progress">
              <span style={{ width: '87%' }}></span>
            </div>
          </div>

          <div className="stat-card">
            <IonIcon icon={warningOutline} className="orange-circle" />
            <h2 className="orange-text">3</h2>
            <p>Reportes Activos</p>
            <small>2 en revisión, 1 resuelto</small>
            <div className="progress orange">
              <span style={{ width: '45%' }}></span>
            </div>
          </div>

          <div className="stat-card">
            <IonIcon icon={trendingUpOutline} className="blue-circle" />
            <h2 className="blue-text">↓ 60%</h2>
            <p>Incidentes del Mes</p>
            <small>Reducción vs. mes anterior</small>
            <strong className="success">Mejora significativa</strong>
          </div>
        </section>

        <section className="panel">
          <h2>Incidentes - Últimos 5 Meses</h2>
          <div className="fake-chart">
            <div></div>
            <div></div>
            <div></div>
            <div className="high"></div>
            <div></div>
          </div>
        </section>
      </AdminLayout>
    </IonPage>
  );
};

export default DashBoardAdmin;