import React, { useEffect, useState } from 'react';

import {
  IonPage,
  IonIcon,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption
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
import { API_URL } from '../services/api';

const Estadisticas: React.FC = () => {

  const [usuarios, setUsuarios] = useState(0);
  const [reportes, setReportes] = useState(0);
  const [cumplimiento, setCumplimiento] = useState(0);

  useEffect(() => {

    const cargarDatos = async () => {

      try {

        const token = localStorage.getItem('token');

        const responseUsuarios = await fetch(
          `${API_URL}/api/usuarios`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const responseReportes = await fetch(
          `${API_URL}/api/reportes`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!responseUsuarios.ok || !responseReportes.ok) {
          throw new Error('Error al obtener los datos');
        }

        const dataUsuarios = await responseUsuarios.json();
        const dataReportes = await responseReportes.json();

        const usuariosData = Array.isArray(dataUsuarios)
          ? dataUsuarios
          : [];

        const reportesData = Array.isArray(dataReportes)
          ? dataReportes
          : [];

        setUsuarios(usuariosData.length);
        setReportes(reportesData.length);

        setCumplimiento(
          usuariosData.length > 0
            ? Math.min(
                100,
                Math.max(
                  0,
                  Math.round(
                    (
                      (usuariosData.length - reportesData.length) /
                      usuariosData.length
                    ) * 100
                  )
                )
              )
            : 0
        );

      } catch (error) {

        console.error(error);

        setUsuarios(0);
        setReportes(0);
        setCumplimiento(0);

      }

    };

    cargarDatos();

  }, []);

  return (
    <IonPage>
      <AdminLayout>

        <div className="admin-content">

          <div className="page-header-card stats-header">
            <div>
              <h1>Dashboard de Estadísticas</h1>
              <p>
                Supervisión del nivel de riesgo y cumplimiento municipal
              </p>
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
              <IonSelect placeholder="Todos los Departamentos" interface="popover" className="custom-stat-select">
                <IonSelectOption value="todos">Todos los Departamentos</IonSelectOption>
                <IonSelectOption value="alcaldia">Alcaldía</IonSelectOption>
                <IonSelectOption value="salud">Salud Municipal</IonSelectOption>
                <IonSelectOption value="educacion">Educación (DAEM)</IonSelectOption>
                <IonSelectOption value="obras">Obras Municipales</IonSelectOption>
                <IonSelectOption value="finanzas">Administración y Finanzas</IonSelectOption>
                <IonSelectOption value="dideco">DIDECO</IonSelectOption>
              </IonSelect>
            </div>

            <div className="stat-input">
              <label>Período</label>
              <IonSelect placeholder="Último Mes" interface="popover" className="custom-stat-select">
                <IonSelectOption value="hoy">Hoy</IonSelectOption>
                <IonSelectOption value="semana">Última Semana</IonSelectOption>
                <IonSelectOption value="mes">Último Mes</IonSelectOption>
                <IonSelectOption value="trimestre">Último Trimestre</IonSelectOption>
                <IonSelectOption value="ano">Año Actual</IonSelectOption>
                <IonSelectOption value="historico">Histórico Completo</IonSelectOption>
              </IonSelect>
            </div>

          </div>

          <div className="stats-cards">

            <div className="metric-card">

              <div className="metric-top">
                <div className="metric-icon green-bg">
                  <IonIcon icon={shieldCheckmarkOutline} />
                </div>

                <IonIcon
                  className="green-text"
                  icon={trendingUpOutline}
                />
              </div>

              <p>Cumplimiento Promedio</p>

              <h2>{cumplimiento}%</h2>

              <small className="green-text">
                +5% vs. mes anterior
              </small>

            </div>

            <div className="metric-card">

              <div className="metric-icon blue-bg">
                <IonIcon icon={peopleOutline} />
              </div>

              <p>Usuarios Activos</p>

              <h2>{usuarios}</h2>

              <small>Total registrados</small>

            </div>

            <div className="metric-card">

              <div className="metric-icon orange-bg">
                <IonIcon icon={shieldOutline} />
              </div>

              <p>Incidentes Reportados</p>

              <h2>{reportes}</h2>

              <small>Historial acumulado</small>

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