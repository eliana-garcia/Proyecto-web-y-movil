import React from 'react';

import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonInput
} from '@ionic/react';

import {
  downloadOutline,
  shieldCheckmarkOutline,
  peopleOutline,
  shieldOutline,
  funnelOutline,
  trendingUpOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const Estadisticas: React.FC = () => {
  return (
    <IonPage>
      <AdminLayout active="Estadísticas">
        <div className="admin-content">

          <div className="page-header-card stats-header">
            <div>
              <h1>Dashboard de Estadísticas</h1>
              <p>Supervisión del nivel de riesgo y cumplimiento municipal</p>
            </div>

            <IonButton className="primary-small-btn">
              <IonIcon icon={downloadOutline} slot="start" />
              Exportar Reporte
            </IonButton>
          </div>

          <div className="filter-box stats-filter">
            <IonIcon icon={funnelOutline} />

            <div className="stat-input">
              <label>Departamento Municipal</label>
              <IonInput />
            </div>

            <div className="stat-input">
              <label>Período</label>
              <IonInput />
            </div>
          </div>

          <div className="stats-cards">
            <div className="metric-card">
              <div className="metric-top">
                <div className="metric-icon green-bg">
                  <IonIcon icon={shieldCheckmarkOutline} />
                </div>
                <IonIcon className="green-text" icon={trendingUpOutline} />
              </div>
              <p>Cumplimiento Promedio</p>
              <h2>91%</h2>
              <small className="green-text">+5% vs. mes anterior</small>
            </div>

            <div className="metric-card">
              <div className="metric-icon blue-bg">
                <IonIcon icon={peopleOutline} />
              </div>
              <p>Usuarios Activos</p>
              <h2>6</h2>
              <small>De 6 totales</small>
            </div>

            <div className="metric-card">
              <div className="metric-icon orange-bg">
                <IonIcon icon={shieldOutline} />
              </div>
              <p>Incidentes Reportados</p>
              <h2>70</h2>
              <small className="orange-text">Últimos 30 días</small>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h2>% de Cumplimiento de Ley por Área</h2>

              <div className="bar-chart">
                <div style={{ height: '92%' }}></div>
                <div style={{ height: '88%' }}></div>
                <div style={{ height: '96%' }}></div>
                <div style={{ height: '100%' }}></div>
                <div style={{ height: '78%' }}></div>
              </div>
            </div>

            <div className="chart-card">
              <h2>Tipos de Ataques Más Frecuentes</h2>

              <div className="fake-pie">
                <span>Phishing 64%</span>
              </div>
            </div>
          </div>

        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default Estadisticas;