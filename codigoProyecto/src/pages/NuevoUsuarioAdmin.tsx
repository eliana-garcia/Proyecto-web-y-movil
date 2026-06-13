import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  useIonToast,
  IonSelect,
  IonSelectOption
} from '@ionic/react';

import { personAddOutline, arrowBackOutline, saveOutline } from 'ionicons/icons';
import AdminLayout from '../components/AdminLayout';
import { API_URL } from '../services/api';
import { formatRUT } from '../services/formatUtils';
import chileData from '../data/regiones.json';

const NuevoUsuarioAdmin: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [form, setForm] = useState({
    nombre_usuario: '',
    rut: '',
    correo: '',
    region: '',
    comuna: ''
  });

  const [comunas, setComunas] = useState<string[]>([]);

  const cambiarValor = (campo: string, valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleRegionChange = (regionName: string) => {
    const regionObj = chileData.regiones.find(r => r.region === regionName);
    setComunas(regionObj ? regionObj.comunas : []);
    setForm(prev => ({ ...prev, region: regionName, comuna: '' }));
  };

  const guardarUsuario = async () => {
    if (!form.nombre_usuario || !form.rut || !form.correo || !form.region || !form.comuna) {
      presentToast({ message: 'Todos los campos son obligatorios', duration: 2000, color: 'warning' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          password: 'CiberSeguridad2026' // Clave genérica
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al registrar');
      }

      presentToast({ message: 'Usuario creado exitosamente. Clave genérica asignada.', duration: 3000, color: 'success' });
      history.push('/GestionUsuarios');
    } catch (error: any) {
      console.error(error);
      presentToast({ message: error.message || 'Error al crear usuario', duration: 3000, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <AdminLayout>
        <div className="admin-content" style={{maxWidth: '800px', margin: '0 auto'}}>
          <div className="page-header-card" style={{justifyContent: 'flex-start', gap: '20px'}}>
            <button 
              onClick={() => history.push('/GestionUsuarios')} 
              style={{background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b'}}
            >
              <IonIcon icon={arrowBackOutline} />
            </button>
            <div className="mini-icon green-bg">
              <IonIcon icon={personAddOutline} />
            </div>
            <div>
              <h1 style={{fontSize: '24px'}}>Nuevo Usuario</h1>
              <p>Crear nueva cuenta municipal</p>
            </div>
          </div>

          <div className="form-panel">
            <div className="incident-form-grid">
              
              <div className="incident-form-group full-width">
                <label>Nombre Completo</label>
                <IonInput 
                  value={form.nombre_usuario} 
                  onIonInput={e => cambiarValor('nombre_usuario', String(e.detail.value))} 
                  className="incident-input"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="incident-form-group">
                <label>RUT</label>
                <IonInput 
                  value={form.rut} 
                  onIonInput={e => cambiarValor('rut', formatRUT(String(e.detail.value)))} 
                  className="incident-input"
                  placeholder="12.345.678-9"
                />
              </div>

              <div className="incident-form-group">
                <label>Correo Electrónico</label>
                <IonInput 
                  type="email"
                  value={form.correo} 
                  onIonInput={e => cambiarValor('correo', String(e.detail.value))} 
                  className="incident-input"
                  placeholder="juan@municipalidad.cl"
                />
              </div>

              <div className="incident-form-group">
                <label>Región</label>
                <IonSelect 
                  value={form.region} 
                  onIonChange={(e) => handleRegionChange(e.detail.value)} 
                  className="incident-input"
                  interface="popover"
                  placeholder="Seleccione Región"
                >
                  {chileData.regiones.map(r => (
                    <IonSelectOption key={r.region} value={r.region}>{r.region}</IonSelectOption>
                  ))}
                </IonSelect>
              </div>

              <div className="incident-form-group">
                <label>Comuna</label>
                <IonSelect 
                  value={form.comuna} 
                  onIonChange={(e) => cambiarValor('comuna', e.detail.value)} 
                  disabled={!form.region}
                  className="incident-input"
                  interface="popover"
                  placeholder="Seleccione Comuna"
                >
                  {comunas.map(c => (
                    <IonSelectOption key={c} value={c}>{c}</IonSelectOption>
                  ))}
                </IonSelect>
              </div>

            </div>
            
            <div style={{background: '#f8fafc', padding: '16px', borderRadius: '10px', marginTop: '24px', border: '1px solid #e2e7f0'}}>
              <strong style={{color: '#111827', display: 'block', marginBottom: '8px'}}>Clave de Acceso</strong>
              <p style={{margin: 0, color: '#64748b', fontSize: '14px'}}>
                Se asignará automáticamente la clave genérica <strong style={{color: '#2563ff'}}>CiberSeguridad2026</strong>. 
                El usuario podrá cambiarla desde su perfil.
              </p>
            </div>

            <IonButton expand="block" className="submit-btn" onClick={guardarUsuario}>
              <IonIcon icon={saveOutline} slot="start" />
              Crear Cuenta
            </IonButton>
          </div>
        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default NuevoUsuarioAdmin;