import React, { useState } from 'react';

import {
  IonPage,
  IonContent,
  IonIcon,
  IonInput
} from '@ionic/react';

import {
  searchOutline,
  funnelOutline,
  checkmarkCircleOutline,
  timeOutline,
  eyeOutline,
  informationCircleOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const reportes = [
  {
    id: 'INC-2026-001',
    titulo: 'Correo sospechoso con solicitud de credenciales',
    fecha: '28/04/2026',
    categoria: 'Phishing',
    departamento: 'Finanzas',
    estado: 'Resuelto',
    prioridad: 'Alta',
    descripcion: 'Recibí un correo solicitando actualizar credenciales bancarias',
    icono: checkmarkCircleOutline
  },
  {
    id: 'INC-2026-002',
    titulo: 'Descarga no autorizada detectada',
    fecha: '29/04/2026',
    categoria: 'Malware',
    departamento: 'TI',
    estado: 'En revisión',
    prioridad: 'Crítica',
    descripcion: 'Se detectó una descarga no autorizada en un equipo municipal.',
    icono: timeOutline
  },
  {
    id: 'INC-2026-003',
    titulo: 'Acceso desde ubicación inusual',
    fecha: '30/04/2026',
    categoria: 'Acceso',
    departamento: 'RRHH',
    estado: 'Pendiente',
    prioridad: 'Media',
    descripcion: 'Inicio de sesión detectado desde una ubicación desconocida.',
    icono: eyeOutline
  },
  {
    id: 'INC-2026-004',
    titulo: 'Enlace sospechoso en mensaje interno',
    fecha: '01/05/2026',
    categoria: 'Phishing',
    departamento: 'Obras',
    estado: 'Pendiente',
    prioridad: 'Baja',
    descripcion: 'Mensaje interno contenía enlace sospechoso.',
    icono: informationCircleOutline
  }
];

const HistorialReportes: React.FC = () => {
  const [seleccionado, setSeleccionado] = useState(reportes[0]);

  return (
    <IonPage>
      <AdminLayout active="Historial de Reportes">
        <div className="admin-content">

          <div className="filter-box">
            <div className="search-box">
              <IonIcon icon={searchOutline} />
              <IonInput placeholder="Buscar por ID o título..." />
            </div>

            <IonIcon className="filter-icon" icon={funnelOutline} />
            <div className="small-filter"></div>
          </div>

          <div className="history-layout">
            <section>
              <h2 className="section-title">Mis Reportes (4)</h2>

              <div className="report-list">
                {reportes.map((reporte) => (
                  <div
                    key={reporte.id}
                    className={`report-card ${
                      seleccionado.id === reporte.id ? 'active-report' : ''
                    }`}
                    onClick={() => setSeleccionado(reporte)}
                  >
                    <div className="report-row">
                      <IonIcon icon={reporte.icono} />
                      <span>{reporte.id}</span>
                    </div>

                    <h3>{reporte.titulo}</h3>
                    <p>{reporte.fecha}</p>

                    <span className={`priority ${reporte.prioridad.toLowerCase()}`}>
                      {reporte.prioridad}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-card">
              <div className="report-row">
                <IonIcon icon={seleccionado.icono} />
                <div>
                  <h2>{seleccionado.id}</h2>
                  <p>{seleccionado.estado}</p>
                </div>

                <span className={`priority detail-priority ${seleccionado.prioridad.toLowerCase()}`}>
                  {seleccionado.prioridad}
                </span>
              </div>

              <h3>{seleccionado.titulo}</h3>

              <div className="detail-grid">
                <div>
                  <span>Categoría</span>
                  <strong>{seleccionado.categoria}</strong>
                </div>

                <div>
                  <span>Fecha de Reporte</span>
                  <strong>{seleccionado.fecha}</strong>
                </div>

                <div>
                  <span>Departamento</span>
                  <strong>{seleccionado.departamento}</strong>
                </div>

                <div>
                  <span>Estado</span>
                  <strong>{seleccionado.estado}</strong>
                </div>
              </div>

              <h4>Descripción</h4>
              <p className="description-text">{seleccionado.descripcion}</p>

              <div className="timeline">
                <h4>Línea de Tiempo</h4>

                <div className="timeline-item blue">
                  <span></span>
                  <p>
                    <strong>Incidente reportado</strong>
                    <br />
                    28/04/2026 - 10:30 AM
                  </p>
                </div>

                <div className="timeline-item orange">
                  <span></span>
                  <p>
                    <strong>En revisión por equipo TI</strong>
                    <br />
                    28/04/2026 - 11:45 AM
                  </p>
                </div>

                <div className="timeline-item green">
                  <span></span>
                  <p>
                    <strong>Incidente resuelto</strong>
                    <br />
                    28/04/2026 - 15:20 PM
                  </p>
                </div>
              </div>
            </section>
          </div>

        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default HistorialReportes;