import React, { useState } from 'react';
import {
  IonPage,
  IonButton,
  IonIcon,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  useIonToast
} from '@ionic/react';

import {
  warningOutline,
  cloudUploadOutline,
  sendOutline
} from 'ionicons/icons';

import { API_URL } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import './ReportarIncidente.css';

const categoriasSeguridad = [
  'Phishing o Correo Sospechoso',
  'Infección por Malware / Virus',
  'Robo de Credenciales',
  'Fuga de Datos Personales',
  'Acceso No Autorizado',
  'Vulnerabilidad en Sistema',
  'Otro'
];

const ReportarIncidente: React.FC = () => {

  const [presentToast] = useIonToast();

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const enviarReporte = async () => {

    if (!titulo || !categoria || !fecha || !descripcion) {

      presentToast({
        message: 'Debes completar los campos obligatorios.',
        duration: 2000,
        color: 'warning'
      });

      return;
    }

    try {

      const token = localStorage.getItem('token');

      const descripcionCompleta = `
Título: ${titulo}

Categoría: ${categoria}

Fecha: ${fecha}

Descripción:
${descripcion}
`;

      const response = await fetch(
        `${API_URL}/api/reportes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            descripcion: descripcionCompleta
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        presentToast({
          message: data.mensaje,
          duration: 2000,
          color: 'danger'
        });

        return;
      }

      presentToast({
        message: 'Incidente reportado correctamente.',
        duration: 2000,
        color: 'success'
      });

      setTitulo('');
      setCategoria('');
      setFecha('');
      setDescripcion('');

    } catch (error) {

      console.error(error);

      presentToast({
        message: 'Error al conectar con el servidor',
        duration: 2000,
        color: 'danger'
      });

    }
  };

  return (
    <IonPage>
      <AdminLayout>
        <div className="admin-content">
          <section className="title-card">
            <div className="round-icon orange-bg">
              <IonIcon icon={warningOutline} />
            </div>
            <div>
              <h1>Reportar Incidente de Seguridad</h1>
              <p>Complete el formulario para informar sobre amenazas o incidentes</p>
            </div>
          </section>

          <section className="form-panel">
            <div className="incident-form-grid">

              <div className="incident-form-group">
                <label>Título del Incidente *</label>
                <IonInput 
                  value={titulo} 
                  onIonInput={(e) => setTitulo(String(e.detail.value))} 
                  placeholder="Ej: Correo sospechoso recibido" 
                  className="incident-input"
                />
              </div>

              <div className="incident-form-group">
                <label>Categoría *</label>
                <IonSelect 
                  value={categoria} 
                  onIonChange={(e) => setCategoria(e.detail.value)} 
                  placeholder="Seleccione Categoría"
                  className="incident-input"
                  interface="popover"
                >
                  {categoriasSeguridad.map(cat => (
                    <IonSelectOption key={cat} value={cat}>{cat}</IonSelectOption>
                  ))}
                </IonSelect>
              </div>

              <div className="incident-form-group full-width">
                <label>Fecha del Incidente *</label>
                <IonInput 
                  type="date" 
                  value={fecha} 
                  onIonInput={(e) => setFecha(String(e.detail.value))} 
                  className="incident-input"
                />
              </div>

              <div className="incident-form-group full-width">
                <label>Descripción Detallada *</label>
                <IonTextarea 
                  value={descripcion} 
                  onIonInput={(e) => setDescripcion(String(e.detail.value))} 
                  placeholder="Describa el incidente con el mayor detalle posible..." 
                  className="incident-textarea"
                />
              </div>

              <div className="incident-form-group full-width">
                <label>Adjuntar Evidencia (Opcional)</label>
                <div className="upload-zone">
                  <IonIcon icon={cloudUploadOutline} />
                  <p>Arrastra archivos aquí o <strong>explora tu equipo</strong></p>
                  <span>Formatos: PNG, JPG, PDF (hasta 10MB)</span>
                </div>
              </div>

            </div>

            <IonButton expand="block" className="submit-incident-btn" onClick={enviarReporte}>
              <IonIcon icon={sendOutline} slot="start" />
              Enviar Reporte
            </IonButton>
          </section>
        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default ReportarIncidente;