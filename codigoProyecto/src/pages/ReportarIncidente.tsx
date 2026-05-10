import React, { useState } from 'react';
import { IonPage, IonButton, IonIcon, IonInput, IonTextarea } from '@ionic/react';
import { warningOutline, cloudUploadOutline } from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const ReportarIncidente: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const enviarReporte = () => {
    if (!titulo || !categoria || !fecha || !descripcion) {
      alert('Debes completar los campos obligatorios.');
      return;
    }

    alert('Incidente reportado correctamente.');
    setTitulo('');
    setCategoria('');
    setFecha('');
    setDescripcion('');
  };

  return (
    <IonPage>
    <AdminLayout>
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
        <div className="incident-grid">
          <div>
            <label>Título del Incidente *</label>
            <IonInput value={titulo} onIonInput={(e) => setTitulo(String(e.detail.value))} placeholder="Ej: Correo sospechoso de phishing recibido" />

            <label>Categoría *</label>
            <IonInput value={categoria} onIonInput={(e) => setCategoria(String(e.detail.value))} />

            <label>Fecha del Incidente *</label>
            <IonInput type="date" value={fecha} onIonInput={(e) => setFecha(String(e.detail.value))} />
          </div>

          <div>
            <label>Descripción Detallada *</label>
            <IonTextarea value={descripcion} onIonInput={(e) => setDescripcion(String(e.detail.value))} placeholder="Describa el incidente con el mayor detalle posible..." />
          </div>
        </div>

        <label>Adjuntar Evidencia (Capturas de pantalla, correos, etc.)</label>
        <div className="upload-box">
          <IonIcon icon={cloudUploadOutline} />
          <p>Arrastra archivos aquí <strong>explora tu equipo</strong></p>
          <span>PNG, JPG, PDF hasta 10MB</span>
        </div>

        <IonButton className="submit-btn" onClick={enviarReporte}>
          Enviar Reporte
        </IonButton>
      </section>
    </AdminLayout>
    </IonPage>
  );
};

export default ReportarIncidente;