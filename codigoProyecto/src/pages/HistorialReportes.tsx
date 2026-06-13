import React, { useEffect, useState } from 'react';

import {
  IonPage,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/react';

import {
  searchOutline,
  funnelOutline,
  checkmarkCircleOutline,
  timeOutline,
  eyeOutline,
  alertCircleOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';
import { API_URL } from '../services/api';

const categoriasDisponibles = [
  'Phishing o Correo Sospechoso',
  'Infección por Malware / Virus',
  'Robo de Credenciales',
  'Fuga de Datos Personales',
  'Acceso No Autorizado',
  'Vulnerabilidad en Sistema',
  'Otro'
];

const HistorialReportes: React.FC = () => {

  const [reportes, setReportes] = useState<any[]>([]);
  const [seleccionado, setSeleccionado] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');
  
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  useEffect(() => {

    const cargarReportes = async () => {

      try {

        const token = localStorage.getItem('token');

        const response = await fetch(
          `${API_URL}/api/reportes`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (!response.ok) {
          throw new Error();
        }

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

  const reportesFiltrados = reportes.filter((reporte) => {
    const textoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda = (reporte.descripcion || '').toLowerCase().includes(textoBusqueda) || 
                             `inc-2026-00${reporte.id}`.includes(textoBusqueda);
    
    const coincideCategoria = filtroCategoria === 'Todas' || (reporte.descripcion || '').includes(filtroCategoria);
    
    const coincideEstado = filtroEstado === 'Todos' || reporte.estado === filtroEstado;

    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  useEffect(() => {

  if (
    reportesFiltrados.length > 0 &&
    !reportesFiltrados.some(
      r => r.id === seleccionado?.id
    )
  ) {
    setSeleccionado(reportesFiltrados[0]);
  }

  }, [reportesFiltrados, seleccionado]);

  // Helper para extraer información limpia
  const extraerInfo = (desc: string) => {
    const info = { titulo: '', categoria: '', fecha: '', descripcionLimpia: desc };
    if(!desc) return info;
    
    const lineas = desc.split('\n');
    let descInicio = -1;

    lineas.forEach((linea, index) => {
      if (linea.startsWith('Título: ')) info.titulo = linea.replace('Título: ', '').trim();
      if (linea.startsWith('Categoría: ')) info.categoria = linea.replace('Categoría: ', '').trim();
      if (linea.startsWith('Fecha: ')) info.fecha = linea.replace('Fecha: ', '').trim();
      if (linea.startsWith('Descripción:')) descInicio = index + 1;
    });

    if (descInicio !== -1) {
      info.descripcionLimpia = lineas.slice(descInicio).join('\n').trim();
    }

    return info;
  };

  const getStatusIcon = (estado: string) => {
    switch(estado) {
      case 'Resuelto': return checkmarkCircleOutline;
      case 'En Revisión': return eyeOutline;
      case 'Pendiente': return alertCircleOutline;
      default: return timeOutline;
    }
  };

  const getPriorityInfo = (estado: string, index: number) => {
    // Simulando prioridades variadas para el diseño visual
    const prioridades = ['Alta', 'Crítica', 'Media', 'Baja'];
    const p = prioridades[index % prioridades.length];
    return p;
  };

  return (
    <IonPage>
      <AdminLayout>
        <div className="admin-content">

          <div className="filter-box">
            <div className="search-box">
              <IonIcon icon={searchOutline} />
              <IonInput placeholder="Buscar por ID o título..." 
              value={busqueda}
              onIonInput={(e) => setBusqueda(String(e.detail.value))} />
            </div>

            <IonIcon
              className="filter-icon"
              icon={funnelOutline}
            />

            <IonSelect 
              className="small-filter" 
              value={filtroCategoria} 
              onIonChange={(e) => setFiltroCategoria(e.detail.value)}
              interface="popover"
            >
              <IonSelectOption value="Todas">Todas las Categorías</IonSelectOption>
              {categoriasDisponibles.map(cat => (
                <IonSelectOption key={cat} value={cat}>{cat}</IonSelectOption>
              ))}
            </IonSelect>

            <IonSelect 
              className="small-filter" 
              value={filtroEstado} 
              onIonChange={(e) => setFiltroEstado(e.detail.value)}
              interface="popover"
            >
              <IonSelectOption value="Todos">Todos los Estados</IonSelectOption>
              <IonSelectOption value="Pendiente">Pendiente</IonSelectOption>
              <IonSelectOption value="En Revisión">En Revisión</IonSelectOption>
              <IonSelectOption value="Resuelto">Resuelto</IonSelectOption>
            </IonSelect>
          </div>

          <div className="history-layout">

            <section>

              <h2 className="section-title">
                Mis Reportes ({reportesFiltrados.length})
              </h2>

              <div className="report-list">

                {reportesFiltrados.length === 0 && (
                  <p style={{color: '#64748b'}}>No se encontraron reportes con estos filtros.</p>
                )}

                {reportesFiltrados.map((reporte, i) => {
                  const info = extraerInfo(reporte.descripcion);
                  const isSelected = seleccionado?.id === reporte.id;
                  const priority = getPriorityInfo(reporte.estado, i);
                  
                  return (
                    <div
                      key={reporte.id}
                      className={`report-card ${isSelected ? 'active-report' : ''}`}
                      onClick={() => setSeleccionado(reporte)}
                    >

                      <div className="report-row-header">
                        <div className="report-id-group">
                          <IonIcon icon={getStatusIcon(reporte.estado)} className={`icon-${reporte.estado.replace(' ', '')}`} />
                          <span>INC-2026-00{reporte.id}</span>
                        </div>
                      </div>

                      <h3 className="report-title-clamp">
                        {info.titulo || `Reporte #${reporte.id}`}
                      </h3>

                      <div className="report-footer">
                        <span className="report-date">{info.fecha || '28/04/2026'}</span>
                        <span className={`priority-badge ${priority.toLowerCase()}`}>
                          {priority}
                        </span>
                      </div>

                    </div>
                  );
                })}

              </div>

            </section>

            {seleccionado && (() => {
              const info = extraerInfo(seleccionado.descripcion);
              const reportIndex = reportesFiltrados.findIndex(r => r.id === seleccionado.id);
              const priority = getPriorityInfo(seleccionado.estado, reportIndex !== -1 ? reportIndex : 0);
              
              return (
                <section className="detail-card">

                  <div className="detail-header-row">
                    <div className="detail-id-group">
                      <IonIcon icon={getStatusIcon(seleccionado.estado)} className={`icon-${seleccionado.estado.replace(' ', '')}`} />
                      <div>
                        <h2>INC-2026-00{seleccionado.id}</h2>
                        <p>{seleccionado.estado}</p>
                      </div>
                    </div>
                    <span className={`priority-badge ${priority.toLowerCase()}`}>
                      {priority}
                    </span>
                  </div>

                  <h3 className="detail-main-title">
                    {info.titulo || 'Reporte de Incidente'}
                  </h3>

                  <div className="detail-grid">

                    <div className="detail-grid-item">
                      <span>Categoría</span>
                      <strong>{info.categoria || 'Phishing'}</strong>
                    </div>

                    <div className="detail-grid-item">
                      <span>Fecha de Reporte</span>
                      <strong>{info.fecha || '28/04/2026'}</strong>
                    </div>

                    <div className="detail-grid-item">
                      <span>Departamento</span>
                      <strong>Finanzas</strong>
                    </div>

                    <div className="detail-grid-item">
                      <span>Estado</span>
                      <strong>{seleccionado.estado}</strong>
                    </div>

                  </div>

                  <h4 className="detail-section-title">Descripción</h4>

                  <p className="description-text">
                    {info.descripcionLimpia || 'Sin descripción detallada proporcionada.'}
                  </p>

                  <h4 className="detail-section-title">Línea de Tiempo</h4>

                  <div className="timeline-container">
                    <div className="timeline-item blue">
                      <span></span>
                      <div>
                        <p className="timeline-action">Incidente reportado</p>
                        <p className="timeline-date">{info.fecha || '28/04/2026'} - 10:30 AM</p>
                      </div>
                    </div>

                    {seleccionado.estado !== 'Pendiente' && (
                      <div className="timeline-item orange">
                        <span></span>
                        <div>
                          <p className="timeline-action">En revisión por equipo TI</p>
                          <p className="timeline-date">{info.fecha || '28/04/2026'} - 11:45 AM</p>
                        </div>
                      </div>
                    )}

                    {seleccionado.estado === 'Resuelto' && (
                      <div className="timeline-item green">
                        <span></span>
                        <div>
                          <p className="timeline-action">Incidente resuelto</p>
                          <p className="timeline-date">{info.fecha || '28/04/2026'} - 15:20 PM</p>
                        </div>
                      </div>
                    )}
                  </div>

                </section>
              );
            })()}

          </div>

        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default HistorialReportes;