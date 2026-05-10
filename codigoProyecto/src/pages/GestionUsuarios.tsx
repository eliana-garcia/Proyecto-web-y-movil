import React from 'react';

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

const usuarios = [
  {
    rut: '12.345.678-9',
    nombre: 'Juan Pérez',
    email: 'juan.perez@municipalidad.cl',
    departamento: 'Obras',
    estado: 'Activo',
    rol: 'Usuario'
  },
  {
    rut: '23.456.789-0',
    nombre: 'María González',
    email: 'maria.gonzalez@municipalidad.cl',
    departamento: 'Finanzas',
    estado: 'Activo',
    rol: 'Usuario'
  },
  {
    rut: '34.567.890-1',
    nombre: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@municipalidad.cl',
    departamento: 'RRHH',
    estado: 'Activo',
    rol: 'Usuario'
  },
  {
    rut: '45.678.901-2',
    nombre: 'Ana Torres',
    email: 'ana.torres@municipalidad.cl',
    departamento: 'TI',
    estado: 'Bloqueado',
    rol: 'Admin'
  }
];

const GestionUsuarios: React.FC = () => {
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
              <h2>6</h2>
            </div>

            <div>
              <p>Activos</p>
              <h2 className="green-text">4</h2>
            </div>

            <div>
              <p>Bloqueados</p>
              <h2 className="red-text">1</h2>
            </div>

            <div>
              <p>Administradores</p>
              <h2 className="blue-text">1</h2>
            </div>
          </div>

          <div className="table-card">
            <h2>Lista de Usuarios (6)</h2>

            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>RUT</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Departamento</th>
                    <th>Estado</th>
                    <th>Rol</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.rut}>
                      <td>{u.rut}</td>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>{u.departamento}</td>
                      <td>
                        <span className={u.estado === 'Activo' ? 'status active' : 'status blocked'}>
                          {u.estado}
                        </span>
                      </td>
                      <td>{u.rol}</td>
                      <td>
                        <IonIcon className="edit-icon" icon={createOutline} />
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