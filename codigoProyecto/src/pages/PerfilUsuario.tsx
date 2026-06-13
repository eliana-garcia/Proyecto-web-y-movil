import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import {
  IonPage,
  IonIcon,
  IonSpinner,
  useIonToast
} from '@ionic/react';

import { 
  personCircleOutline, 
  arrowBackOutline,
  mailOutline,
  locationOutline,
  shieldCheckmarkOutline,
  documentTextOutline,
  calendarOutline,
  alertCircleOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';
import { API_URL } from '../services/api';

const PerfilUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [usuario, setUsuario] = useState<any>(null);
  const [reportes, setReportes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem('token');
      try {
        // Cargar Usuario
        const resUsuario = await fetch(`${API_URL}/api/usuarios`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataUsuarios = await resUsuario.json();
        const userEncontrado = (Array.isArray(dataUsuarios) ? dataUsuarios : []).find(u => u.id === parseInt(id));
        
        if (!userEncontrado) throw new Error('Usuario no encontrado');
        setUsuario(userEncontrado);

        // Cargar Reportes
        const resReportes = await fetch(`${API_URL}/api/reportes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataReportes = await resReportes.json();
        const userReportes = (Array.isArray(dataReportes) ? dataReportes : []).filter(r => r.usuario_id === parseInt(id));
        setReportes(userReportes);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
        presentToast({ message: 'Error al cargar el perfil', duration: 2000, color: 'danger' });
      }
    };

    cargarDatos();
  }, [id]);

  const extraerInfo = (desc: string) => {
    const info = { titulo: '', categoria: '', fecha: '' };
    if(!desc) return info;
    
    const lineas = desc.split('\n');
    lineas.forEach(linea => {
      if (linea.startsWith('Título: ')) info.titulo = linea.replace('Título: ', '').trim();
      if (linea.startsWith('Categoría: ')) info.categoria = linea.replace('Categoría: ', '').trim();
      if (linea.startsWith('Fecha: ')) info.fecha = linea.replace('Fecha: ', '').trim();
    });
    return info;
  };

  return (
    <IonPage>
      <AdminLayout>
        <div className="admin-content" style={{maxWidth: '1000px', margin: '0 auto'}}>
          
          <div className="page-header-card" style={{justifyContent: 'flex-start', gap: '20px', marginBottom: '24px'}}>
            <button 
              onClick={() => history.push('/GestionUsuarios')} 
              style={{background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b'}}
            >
              <IonIcon icon={arrowBackOutline} />
            </button>
            <div className="header-icon blue-bg">
              <IonIcon icon={personCircleOutline} />
            </div>
            <div>
              <h1 style={{fontSize: '26px'}}>Perfil de Usuario</h1>
              <p>Auditoría e historial de actividad</p>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <IonSpinner />
            </div>
          ) : usuario ? (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px'}} className="perfil-layout">
              
              {/* COLUMNA IZQUIERDA: DATOS DEL USUARIO */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <div className="panel" style={{padding: '32px', textAlign: 'center'}}>
                  <div style={{width: '90px', height: '90px', borderRadius: '50%', background: '#eaf1ff', color: '#2563ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', margin: '0 auto 20px'}}>
                    <IonIcon icon={personCircleOutline} />
                  </div>
                  <h2 style={{margin: '0 0 5px', fontSize: '22px', fontWeight: 800}}>{usuario.nombre_usuario}</h2>
                  <span className="status active" style={{display: 'inline-block', marginBottom: '20px'}}>
                    {usuario.rol_id === 1 ? 'Administrador' : 'Funcionario'}
                  </span>

                  <div style={{textAlign: 'left', marginTop: '10px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', borderBottom: '1px solid #f1f5f9'}}>
                      <IonIcon icon={mailOutline} style={{color: '#94a3b8', fontSize: '20px'}}/>
                      <div>
                        <small style={{display: 'block', color: '#64748b', fontSize: '12px'}}>Correo Electrónico</small>
                        <strong style={{color: '#1e293b'}}>{usuario.correo}</strong>
                      </div>
                    </div>
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', borderBottom: '1px solid #f1f5f9'}}>
                      <IonIcon icon={shieldCheckmarkOutline} style={{color: '#94a3b8', fontSize: '20px'}}/>
                      <div>
                        <small style={{display: 'block', color: '#64748b', fontSize: '12px'}}>RUT</small>
                        <strong style={{color: '#1e293b'}}>{usuario.rut}</strong>
                      </div>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0'}}>
                      <IonIcon icon={locationOutline} style={{color: '#94a3b8', fontSize: '20px'}}/>
                      <div>
                        <small style={{display: 'block', color: '#64748b', fontSize: '12px'}}>Ubicación</small>
                        <strong style={{color: '#1e293b'}}>{usuario.comuna}, {usuario.region}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="panel" style={{padding: '24px'}}>
                  <h3 style={{margin: '0 0 16px', fontSize: '16px', color: '#111827', fontWeight: 700}}>Estadísticas del Usuario</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#f8fafc', borderRadius: '10px'}}>
                    <span style={{color: '#64748b', fontWeight: 600}}>Total Reportes Emitidos</span>
                    <strong style={{fontSize: '20px', color: '#2563ff'}}>{reportes.length}</strong>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: HISTORIAL DE REPORTES */}
              <div className="panel" style={{padding: '32px'}}>
                <h2 style={{margin: '0 0 24px', fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <IonIcon icon={documentTextOutline} style={{color: '#2563ff'}}/>
                  Historial de Incidentes Reportados
                </h2>

                {reportes.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1'}}>
                    <IonIcon icon={documentTextOutline} style={{fontSize: '48px', color: '#94a3b8', marginBottom: '10px'}}/>
                    <p style={{color: '#64748b', margin: 0}}>Este usuario no ha reportado ningún incidente de seguridad.</p>
                  </div>
                ) : (
                  <div className="report-list">
                    {reportes.map((reporte) => {
                      const info = extraerInfo(reporte.descripcion);
                      return (
                        <div key={reporte.id} className="report-card" style={{padding: '20px', border: '1px solid #e2e7f0', borderRadius: '12px', marginBottom: '16px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#2563ff', fontWeight: 700}}>
                              <IonIcon icon={shieldCheckmarkOutline} />
                              <span>REP-{reporte.id}</span>
                            </div>
                            <span className={`priority-badge ${reporte.estado === 'Resuelto' ? 'baja' : reporte.estado === 'Pendiente' ? 'alta' : 'media'}`}>
                              {reporte.estado}
                            </span>
                          </div>
                          
                          <h3 style={{margin: '0 0 10px', fontSize: '16px', color: '#111827'}}>{info.titulo || `Reporte #${reporte.id}`}</h3>
                          
                          <div style={{display: 'flex', gap: '20px', color: '#64748b', fontSize: '13px'}}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                              <IonIcon icon={calendarOutline} /> {info.fecha || 'Sin fecha'}
                            </span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                              <IonIcon icon={alertCircleOutline} /> {info.categoria || 'Incidente General'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <p>Usuario no encontrado.</p>
          )}

        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default PerfilUsuario;