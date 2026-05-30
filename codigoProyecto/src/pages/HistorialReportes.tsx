import React, { useEffect, useState } from 'react';

import {
  IonPage,
  IonIcon,
  IonInput
} from '@ionic/react';

import {
  searchOutline,
  funnelOutline,
  informationCircleOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const HistorialReportes: React.FC = () => {

  const [reportes, setReportes] = useState<any[]>([]);
  const [seleccionado, setSeleccionado] = useState<any>(null);

  useEffect(() => {

    const cargarReportes = async () => {

      try {

        const token = localStorage.getItem('token');

        const response = await fetch(
          'http://localhost:3000/api/reportes',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        setReportes(data);

        if (data.length > 0) {
          setSeleccionado(data[0]);
        }

      } catch (error) {

        console.error(error);

      }
    };

    cargarReportes();

  }, []);

  return (
    <IonPage>
      <AdminLayout active="Historial de Reportes">
        <div className="admin-content">

          <div className="filter-box">
            <div className="search-box">
              <IonIcon icon={searchOutline} />
              <IonInput placeholder="Buscar reportes..." />
            </div>

            <IonIcon
              className="filter-icon"
              icon={funnelOutline}
            />

            <div className="small-filter"></div>
          </div>

          <div className="history-layout">

            <section>

              <h2 className="section-title">
                Mis Reportes ({reportes.length})
              </h2>

              <div className="report-list">

                {reportes.map((reporte) => (

                  <div
                    key={reporte.id}
                    className={`report-card ${
                      seleccionado?.id === reporte.id
                        ? 'active-report'
                        : ''
                    }`}
                    onClick={() =>
                      setSeleccionado(reporte)
                    }
                  >

                    <div className="report-row">
                      <IonIcon
                        icon={informationCircleOutline}
                      />
                      <span>
                        REP-{reporte.id}
                      </span>
                    </div>

                    <h3>
                      Reporte #{reporte.id}
                    </h3>

                    <p>
                      Estado: {reporte.estado}
                    </p>

                    <span className="priority">
                      {reporte.estado}
                    </span>

                  </div>

                ))}

              </div>

            </section>

            {seleccionado && (

              <section className="detail-card">

                <div className="report-row">

                  <IonIcon
                    icon={informationCircleOutline}
                  />

                  <div>
                    <h2>
                      REP-{seleccionado.id}
                    </h2>

                    <p>
                      {seleccionado.estado}
                    </p>
                  </div>

                </div>

                <h3>
                  Reporte de Incidente
                </h3>

                <div className="detail-grid">

                  <div>
                    <span>ID Usuario</span>
                    <strong>
                      {seleccionado.usuario_id}
                    </strong>
                  </div>

                  <div>
                    <span>Estado</span>
                    <strong>
                      {seleccionado.estado}
                    </strong>
                  </div>

                </div>

                <h4>Descripción</h4>

                <p className="description-text">
                  {seleccionado.descripcion}
                </p>

              </section>

            )}

          </div>

        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default HistorialReportes;