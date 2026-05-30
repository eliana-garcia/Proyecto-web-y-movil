import React, { useEffect, useState } from 'react';

import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonInput
} from '@ionic/react';

import {
  personAddOutline,
  downloadOutline,
  searchOutline,
  funnelOutline,
  createOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const GestionUsuarios: React.FC = () => {

  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/api/usuarios', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
      })
      .catch(error => {
        console.error('Error al cargar usuarios:', error);
      });

  }, []);

  return (
    <IonPage>
      <AdminLayout active="Gestión de Usuarios">
        <div className="admin-content">

          <div className="page-header-card user-header">
            <div>
              <h1>Gestión de Usuarios</h1>
              <p>Administración de cuentas municipales (Auditoría por RUT)</p>
            </div>

            <div className="header-actions">
              <IonButton className="green-btn">
                <IonIcon icon={personAddOutline} slot="start" />
                Nuevo Usuario
              </IonButton>

              <IonButton className="primary-small-btn">
                <IonIcon icon={downloadOutline} slot="start" />
                Exportar
              </IonButton>
            </div>
          </div>

          <div className="filter-box">
            <div className="search-box">
              <IonIcon icon={searchOutline} />
              <IonInput placeholder="Buscar por RUT, nombre o email..." />
            </div>

            <IonIcon className="filter-icon" icon={funnelOutline} />
            <div className="small-filter"></div>
            <div className="small-filter"></div>
          </div>

          <div className="users-metrics">

            <div>
              <p>Total Usuarios</p>
              <h2>{usuarios.length}</h2>
            </div>

            <div>
              <p>Activos</p>
              <h2 className="green-text">{usuarios.length}</h2>
            </div>

            <div>
              <p>Bloqueados</p>
              <h2 className="red-text">0</h2>
            </div>

            <div>
              <p>Administradores</p>
              <h2 className="blue-text">
                {usuarios.filter(u => u.rol_id === 1).length}
              </h2>
            </div>

          </div>

          <div className="table-card">

            <h2>
              Lista de Usuarios ({usuarios.length})
            </h2>

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
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>

                  {usuarios.map((u) => (

                    <tr key={u.id}>
                      <td>{u.rut}</td>

                      <td>{u.nombre_usuario}</td>

                      <td>{u.correo}</td>

                      <td>{u.comuna}</td>

                      <td>
                        <span className="status active">
                          Activo
                        </span>
                      </td>

                      <td>
                        {u.rol_id === 1
                          ? 'Administrador'
                          : 'Usuario'}
                      </td>

                      <td>
                        <IonIcon
                          className="edit-icon"
                          icon={createOutline}
                        />
                      </td>
                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default GestionUsuarios;