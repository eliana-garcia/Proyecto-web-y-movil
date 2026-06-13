import React, { useEffect, useState } from 'react';

import {
  IonPage,
  IonIcon,
  IonButton,
  IonInput,
  IonSpinner,
  useIonToast,
  IonModal,
  IonSelect,
  IonSelectOption
} from '@ionic/react';

import {
  downloadOutline,
  searchOutline,
  createOutline,
  trashOutline,
  closeOutline,
  saveOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';
import { API_URL } from '../services/api';

const GestionReportes: React.FC = () => {

  const [presentToast] = useIonToast();

  const [reportes, setReportes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Estados para el Modal de Edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [reporteEditando, setReporteEditando] = useState<any>(null);

  const cargarReportes = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/reportes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setReportes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        presentToast({ message: 'Error al cargar reportes', duration: 2000, color: 'danger' });
      });
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  const eliminarReporte = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('¿Desea eliminar este reporte?')) return;

    try {
      const response = await fetch(`${API_URL}/api/reportes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();

      setReportes(prev => prev.filter(r => r.id !== id));
      presentToast({ message: 'Reporte eliminado correctamente', duration: 2000, color: 'success' });
    } catch (error) {
      presentToast({ message: 'No se pudo eliminar el reporte', duration: 2000, color: 'danger' });
    }
  };

  const abrirModalEdicion = (reporte: any) => {
    setReporteEditando({ ...reporte });
    setShowEditModal(true);
  };

  const cerrarModalEdicion = () => {
    setShowEditModal(false);
    setReporteEditando(null);
  };

  const guardarEdicion = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/reportes/${reporteEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          descripcion: reporteEditando.descripcion, // Mantenemos la descripción original
          estado: reporteEditando.estado
        })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      presentToast({ message: 'Estado del reporte actualizado', duration: 2000, color: 'success' });
      cerrarModalEdicion();
      cargarReportes(); // Recargar la tabla
    } catch (error) {
      console.error(error);
      presentToast({ message: 'Error al actualizar reporte', duration: 2000, color: 'danger' });
    }
  };

  // Helper para extraer información de la descripción bruta
  const extraerInfo = (desc: string) => {
    const info = { titulo: '', categoria: '', fecha: '', detalle: '' };
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
      info.detalle = lineas.slice(descInicio).join('\n').trim();
    } else {
       info.detalle = desc; // Fallback si no tiene el formato esperado
    }
    return info;
  };

  const formatearFecha = (fechaISO: string) => {
    if (!fechaISO) return '';
    try {
      const date = new Date(fechaISO);
      return date.toLocaleDateString('es-CL', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return fechaISO;
    }
  };

  const reportesFiltrados = reportes.filter(r => {
    const info = extraerInfo(r.descripcion);
    const textToSearch = `${info.titulo} ${info.categoria} ${r.estado} INC-2026-00${r.id}`.toLowerCase();
    return textToSearch.includes(busqueda.toLowerCase());
  });

  const exportarCSV = () => {
    const encabezados = 'ID,Título,Categoría,Estado,Fecha de Sistema\n';
    const filas = reportesFiltrados.map(r => {
      const info = extraerInfo(r.descripcion);
      return `INC-2026-00${r.id},"${info.titulo}","${info.categoria}",${r.estado},${formatearFecha(r.fecha)}`;
    }).join('\n');

    const csv = encabezados + filas;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reportes.csv';
    link.click();
  };

  const totalPendientes = reportes.filter(r => r.estado === 'Pendiente').length;
  const totalEnRevision = reportes.filter(r => r.estado === 'En Revisión').length;
  const totalResueltos = reportes.filter(r => r.estado === 'Resuelto').length;

  return (
    <IonPage>
      <AdminLayout>
        <div className="admin-content">

          <div className="page-header-card">
            <div>
              <h1>Gestión de Reportes</h1>
              <p>Administración de incidentes de seguridad</p>
            </div>
            <IonButton className="primary-small-btn" onClick={exportarCSV}>
              <IonIcon icon={downloadOutline} slot="start" />
              Exportar
            </IonButton>
          </div>

          <div className="filter-box" style={{marginBottom: '0', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: 'none'}}>
            <div className="search-box" style={{maxWidth: 'none', border: 'none'}}>
              <IonIcon icon={searchOutline} />
              <IonInput
                placeholder="Buscar por ID, título, categoría o estado..."
                value={busqueda}
                onIonInput={(e) => setBusqueda(String(e.detail.value))}
              />
            </div>
          </div>

          <div className="users-metrics-clean" style={{background: 'white', padding: '0 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderLeft: '1px solid #e2e7f0', borderRight: '1px solid #e2e7f0', borderBottom: '1px solid #e2e7f0', borderBottomLeftRadius: '14px', borderBottomRightRadius: '14px', marginBottom: '24px'}}>
            <div style={{padding: '10px 0'}}>
              <p style={{color: '#64748b', margin: '0 0 8px'}}>Total Reportes</p>
              <h2 style={{margin: 0, fontSize: '28px', color: '#111827'}}>{reportes.length}</h2>
            </div>
            <div style={{padding: '10px 0'}}>
              <p style={{color: '#64748b', margin: '0 0 8px'}}>Pendientes</p>
              <h2 className="red-text" style={{margin: 0, fontSize: '28px'}}>{totalPendientes}</h2>
            </div>
            <div style={{padding: '10px 0'}}>
              <p style={{color: '#64748b', margin: '0 0 8px'}}>En Revisión</p>
              <h2 className="orange-text" style={{margin: 0, fontSize: '28px'}}>{totalEnRevision}</h2>
            </div>
            <div style={{padding: '10px 0'}}>
              <p style={{color: '#64748b', margin: '0 0 8px'}}>Resueltos</p>
              <h2 className="green-text" style={{margin: 0, fontSize: '28px'}}>{totalResueltos}</h2>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <IonSpinner />
            </div>
          ) : (
            <div className="table-card">
              <h2 style={{margin: '0 0 20px', fontSize: '20px'}}>Lista de Reportes ({reportesFiltrados.length})</h2>
              
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Categoría</th>
                      <th style={{width: '35%'}}>Título / Resumen</th>
                      <th>Fecha Registro</th>
                      <th>Estado</th>
                      <th style={{textAlign: 'right'}}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportesFiltrados.length === 0 && (
                      <tr><td colSpan={6}>No se encontraron reportes.</td></tr>
                    )}
                    {reportesFiltrados.map(r => {
                      const info = extraerInfo(r.descripcion);
                      return (
                        <tr key={r.id}>
                          <td style={{color: '#64748b', fontWeight: 700}}>INC-2026-00{r.id}</td>
                          <td><span style={{background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '13px'}}>{info.categoria || 'General'}</span></td>
                          <td>
                            <strong style={{display: 'block', color: '#111827', marginBottom: '4px'}}>{info.titulo || 'Sin Título'}</strong>
                            <span style={{color: '#64748b', fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{info.detalle}</span>
                          </td>
                          <td style={{color: '#64748b', fontSize: '14px'}}>{formatearFecha(r.fecha)}</td>
                          <td>
                            <span className={`priority-badge ${r.estado === 'Resuelto' ? 'baja' : r.estado === 'Pendiente' ? 'alta' : 'media'}`}>
                              {r.estado}
                            </span>
                          </td>
                          <td style={{textAlign: 'right'}}>
                            <IonIcon
                              className="edit-icon"
                              style={{color: '#2563ff', fontSize: '20px', cursor: 'pointer', marginRight: '10px'}}
                              icon={createOutline}
                              onClick={() => abrirModalEdicion(r)}
                            />
                            <IonIcon
                              className="delete-icon"
                              style={{color: '#ef4444', fontSize: '20px', cursor: 'pointer'}}
                              icon={trashOutline}
                              onClick={() => eliminarReporte(r.id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* MODAL DE EDICIÓN */}
        <IonModal isOpen={showEditModal} onDidDismiss={cerrarModalEdicion} className="custom-modal">
          <div className="modal-content-wrapper">
            <div className="modal-header">
              <h2>Gestionar Estado del Reporte</h2>
              <button onClick={cerrarModalEdicion} className="modal-close-btn">
                <IonIcon icon={closeOutline} />
              </button>
            </div>
            
            {reporteEditando && (() => {
              const info = extraerInfo(reporteEditando.descripcion);
              return (
                <div className="modal-body form-panel" style={{border: 'none', padding: '0', boxShadow: 'none'}}>
                  
                  <div style={{background: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #e2e7f0'}}>
                    <strong style={{display: 'block', color: '#111827', fontSize: '16px', marginBottom: '8px'}}>{info.titulo}</strong>
                    <div style={{display: 'flex', gap: '16px', color: '#64748b', fontSize: '13px', marginBottom: '12px'}}>
                      <span><strong>ID:</strong> INC-2026-00{reporteEditando.id}</span>
                      <span><strong>Categoría:</strong> {info.categoria}</span>
                    </div>
                    <p style={{margin: 0, color: '#475569', fontSize: '14px', lineHeight: 1.5}}>{info.detalle}</p>
                  </div>

                  <label>Actualizar Estado</label>
                  <IonSelect
                    value={reporteEditando.estado}
                    onIonChange={(e) => setReporteEditando({...reporteEditando, estado: e.detail.value})}
                    interface="popover"
                    style={{border: '1px solid #d7dce5', borderRadius: '9px', padding: '10px', width: '100%', marginBottom: '24px'}}
                  >
                    <IonSelectOption value="Pendiente">Pendiente</IonSelectOption>
                    <IonSelectOption value="En Revisión">En Revisión</IonSelectOption>
                    <IonSelectOption value="Resuelto">Resuelto</IonSelectOption>
                  </IonSelect>

                  <IonButton expand="block" className="submit-btn" onClick={guardarEdicion} style={{margin: 0}}>
                    <IonIcon icon={saveOutline} slot="start" />
                    Guardar Cambios
                  </IonButton>
                </div>
              );
            })()}
          </div>
        </IonModal>

      </AdminLayout>
    </IonPage>
  );
};

export default GestionReportes;