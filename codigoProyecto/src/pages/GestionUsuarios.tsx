import React, { useEffect, useState } from 'react';

import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonInput,
  useIonToast,
  IonSpinner,
  IonModal,
  IonSelect,
  IonSelectOption
} from '@ionic/react';

import {
  personAddOutline,
  downloadOutline,
  searchOutline,
  createOutline,
  trashOutline,
  lockClosedOutline,
  lockOpenOutline,
  closeOutline,
  saveOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

import { useHistory } from 'react-router-dom';
import { API_URL } from '../services/api';
import { formatRUT } from '../services/formatUtils';
import chileData from '../data/regiones.json';

const GestionUsuarios: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Estado para la modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<any>(null);
  const [editComunas, setEditComunas] = useState<string[]>([]);

  const cargarUsuarios = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/usuarios`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Simulamos un campo 'activo' si la API no lo trae
        const usuariosMapeados = (Array.isArray(data) ? data : []).map(u => ({
          ...u,
          activo: u.activo !== undefined ? u.activo : true
        }));
        setUsuarios(usuariosMapeados);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
        presentToast({ message: 'Error al cargar usuarios', duration: 2000, color: 'danger' });
      });
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const eliminarUsuario = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('¿Desea eliminar este usuario?')) return;

    try {
      const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al eliminar');

      setUsuarios(prev => prev.filter(u => u.id !== id));
      presentToast({ message: 'Usuario eliminado correctamente', duration: 2000, color: 'success' });
    } catch (error) {
      console.error(error);
      presentToast({ message: 'No se pudo eliminar el usuario', duration: 2000, color: 'danger' });
    }
  };

  const toggleBloqueo = (id: number, estadoActual: boolean) => {
    // Aquí idealmente harías una llamada PUT/PATCH a la API
    // Por ahora, simulamos la actualización en el estado local
    setUsuarios(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, activo: !estadoActual };
      }
      return u;
    }));

    presentToast({ 
      message: `Usuario ${!estadoActual ? 'desbloqueado' : 'bloqueado'} correctamente`, 
      duration: 2000, 
      color: !estadoActual ? 'success' : 'warning' 
    });
  };

  const abrirModalEdicion = (usuario: any) => {
    setUsuarioEditando({ ...usuario });
    if (usuario.region) {
      const regionObj = chileData.regiones.find(r => r.region === usuario.region);
      setEditComunas(regionObj ? regionObj.comunas : []);
    }
    setShowEditModal(true);
  };

  const cerrarModalEdicion = () => {
    setShowEditModal(false);
    setUsuarioEditando(null);
  };

  const guardarEdicion = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/usuarios/${usuarioEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre_usuario: usuarioEditando.nombre_usuario,
          correo: usuarioEditando.correo,
          region: usuarioEditando.region,
          comuna: usuarioEditando.comuna
        })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      presentToast({ message: 'Usuario actualizado correctamente', duration: 2000, color: 'success' });
      cerrarModalEdicion();
      cargarUsuarios(); // Recargar la lista
    } catch (error) {
      console.error(error);
      presentToast({ message: 'Error al actualizar usuario', duration: 2000, color: 'danger' });
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    (u.rut || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (u.nombre_usuario || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (u.correo || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const exportarCSV = () => {
    const encabezados = 'RUT,Nombre,Correo,Comuna,Estado,Rol\n';
    const filas = usuariosFiltrados
      .map(
        (u) =>
          `${u.rut},${u.nombre_usuario},${u.correo},${u.comuna},${u.activo ? 'Activo' : 'Bloqueado'},${
            u.rol_id === 1 ? 'Administrador' : 'Usuario'
          }`
      )
      .join('\n');
    const csv = encabezados + filas;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'usuarios.csv';
    link.click();
    presentToast({ message: 'Archivo exportado correctamente', duration: 2000, color: 'success' });
  };

  const totalAdmins = usuarios.filter(u => u.rol_id === 1).length;
  const totalBloqueados = usuarios.filter(u => !u.activo).length;
  const totalActivos = usuarios.filter(u => u.activo).length;

  return (
    <IonPage>
      <AdminLayout>
        <div className="admin-content">

          <div className="page-header-card user-header">
            <div>
              <h1>Gestión de Usuarios</h1>
              <p>Administración de cuentas municipales (Auditoría por RUT)</p>
            </div>

            <div className="header-actions">
              <IonButton className="green-btn" routerLink="/NuevoUsuarioAdmin">
                <IonIcon icon={personAddOutline} slot="start" />
                Nuevo Usuario
              </IonButton>

              <IonButton className="primary-small-btn" onClick={exportarCSV}>
                <IonIcon icon={downloadOutline} slot="start" />
                Exportar
              </IonButton>
            </div>
          </div>

          <div className="filter-box" style={{marginBottom: '0', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: 'none'}}>
            <div className="search-box" style={{maxWidth: 'none', border: 'none'}}>
              <IonIcon icon={searchOutline} />
              <IonInput
                placeholder="Buscar por RUT, nombre o email..."
                value={busqueda}
                onIonInput={(e) => {
                  const val = String(e.detail.value);
                  if (/^[0-9]/.test(val)) {
                    setBusqueda(formatRUT(val));
                  } else {
                    setBusqueda(val);
                  }
                }}
              />
            </div>
          </div>

          <div className="users-metrics-clean" style={{background: 'white', padding: '0 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderLeft: '1px solid #e2e7f0', borderRight: '1px solid #e2e7f0', borderBottom: '1px solid #e2e7f0', borderBottomLeftRadius: '14px', borderBottomRightRadius: '14px', marginBottom: '24px'}}>
            <div style={{padding: '10px 0'}}>
              <p style={{color: '#64748b', margin: '0 0 8px'}}>Total Usuarios</p>
              <h2 style={{margin: 0, fontSize: '28px', color: '#111827'}}>{usuarios.length}</h2>
            </div>
            <div style={{padding: '10px 0'}}>
              <p style={{color: '#64748b', margin: '0 0 8px'}}>Activos</p>
              <h2 className="green-text" style={{margin: 0, fontSize: '28px'}}>{totalActivos}</h2>
            </div>
            <div style={{padding: '10px 0'}}>
              <p style={{color: '#64748b', margin: '0 0 8px'}}>Bloqueados</p>
              <h2 className="red-text" style={{margin: 0, fontSize: '28px'}}>{totalBloqueados}</h2>
            </div>
            <div style={{padding: '10px 0'}}>
              <p style={{color: '#64748b', margin: '0 0 8px'}}>Administradores</p>
              <h2 className="blue-text" style={{margin: 0, fontSize: '28px'}}>{totalAdmins}</h2>
            </div>
          </div>

          {loading ?(
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <IonSpinner />
            </div>
          ): (
            <div className="table-card">
              <h2 style={{margin: '0 0 20px', fontSize: '20px'}}>Lista de Usuarios ({usuariosFiltrados.length})</h2>
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>RUT</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Comuna</th>
                      <th>Estado</th>
                      <th>Rol</th>
                      <th style={{textAlign: 'right'}}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.length === 0 && (
                      <tr><td colSpan={7}>No se encontraron usuarios.</td></tr>
                    )}
                    {usuariosFiltrados.map((u) => (
                      <tr key={u.id}>
                        <td>{u.rut}</td>
                        <td 
                          style={{color: '#2563ff', fontWeight: 'bold', cursor: 'pointer'}}
                          onClick={() => history.push(`/PerfilUsuario/${u.id}`)}
                        >
                          {u.nombre_usuario}
                        </td>
                        <td>{u.correo}</td>
                        <td>{u.comuna}</td>
                        <td>
                          <span className={`status ${u.activo ? 'active' : 'blocked'}`}>
                            {u.activo ? 'Activo' : 'Bloqueado'}
                          </span>
                        </td>
                        <td>{u.rol_id === 1 ? 'Administrador' : 'Usuario'}</td>
                        <td style={{textAlign: 'right'}}>
                          <IonIcon
                            className="edit-icon"
                            style={{color: '#2563ff', fontSize: '20px', cursor: 'pointer', marginRight: '10px'}}
                            icon={createOutline}
                            onClick={() => abrirModalEdicion(u)}
                          />
                          <IonIcon
                            className="delete-icon"
                            style={{color: u.activo ? '#f59e0b' : '#10b981', fontSize: '20px', cursor: 'pointer', marginRight: '10px'}}
                            icon={u.activo ? lockClosedOutline : lockOpenOutline}
                            onClick={() => toggleBloqueo(u.id, u.activo)}
                          />
                          <IonIcon
                            className="delete-icon"
                            style={{color: '#ef4444', fontSize: '20px', cursor: 'pointer'}}
                            icon={trashOutline}
                            onClick={() => eliminarUsuario(u.id)}
                          />
                        </td>
                      </tr>
                    ))}
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
              <h2>Editar Usuario</h2>
              <button onClick={cerrarModalEdicion} className="modal-close-btn">
                <IonIcon icon={closeOutline} />
              </button>
            </div>
            
            {usuarioEditando && (
              <div className="modal-body form-panel" style={{border: 'none', padding: '0', boxShadow: 'none'}}>
                <label>Nombre Completo</label>
                <IonInput 
                  value={usuarioEditando.nombre_usuario} 
                  onIonInput={e => setUsuarioEditando({...usuarioEditando, nombre_usuario: String(e.detail.value)})}
                />

                <label>Correo Electrónico</label>
                <IonInput 
                  value={usuarioEditando.correo} 
                  onIonInput={e => setUsuarioEditando({...usuarioEditando, correo: String(e.detail.value)})}
                />

                <label>Región</label>
                <IonSelect
                  value={usuarioEditando.region}
                  onIonChange={(e) => {
                    const region = e.detail.value;
                    const regionObj = chileData.regiones.find(r => r.region === region);
                    setEditComunas(regionObj ? regionObj.comunas : []);
                    setUsuarioEditando({...usuarioEditando, region, comuna: ''});
                  }}
                  interface="popover"
                  style={{border: '1px solid #d7dce5', borderRadius: '9px', padding: '10px'}}
                >
                  {chileData.regiones.map((r) => (
                    <IonSelectOption key={r.region} value={r.region}>{r.region}</IonSelectOption>
                  ))}
                </IonSelect>

                <label>Comuna</label>
                <IonSelect
                  value={usuarioEditando.comuna}
                  onIonChange={e => setUsuarioEditando({...usuarioEditando, comuna: e.detail.value})}
                  disabled={!usuarioEditando.region}
                  interface="popover"
                  style={{border: '1px solid #d7dce5', borderRadius: '9px', padding: '10px'}}
                >
                  {editComunas.map((c) => (
                    <IonSelectOption key={c} value={c}>{c}</IonSelectOption>
                  ))}
                </IonSelect>

                <IonButton expand="block" className="submit-btn" onClick={guardarEdicion}>
                  <IonIcon icon={saveOutline} slot="start" />
                  Guardar Cambios
                </IonButton>
              </div>
            )}
          </div>
        </IonModal>

      </AdminLayout>
    </IonPage>
  );
};

export default GestionUsuarios;