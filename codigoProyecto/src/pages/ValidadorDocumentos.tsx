import React from 'react';

import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton
} from '@ionic/react';

import {
  documentTextOutline,
  cloudUploadOutline,
  informationCircleOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const ValidadorDocumentos: React.FC = () => {
  return (
    <IonPage>
      <AdminLayout active="Validador de Documentos">
        <IonContent fullscreen className="admin-content">

          <div className="page-header-card">
            <div>
              <h1>Validador de Documentos</h1>
              <p>Detecta y anonimiza datos sensibles en documentos oficiales</p>
            </div>

            <div className="header-icon purple">
              <IonIcon icon={documentTextOutline} />
            </div>
          </div>

          <div className="upload-card">
            <div className="upload-box large">
              <IonIcon icon={cloudUploadOutline} />
              <h2>Cargar Documento</h2>
              <p>
                Arrastra un archivo PDF o Word aquí,
                <span> explora tu equipo</span>
              </p>
              <small>Formatos soportados: PDF, DOC, DOCX, TXT (máx. 10MB)</small>

              <div className="divider-upload">
                <span></span>
                <p>o</p>
                <span></span>
              </div>

              <IonButton className="purple-btn">
                Cargar Documento de Ejemplo
              </IonButton>
            </div>

            <div className="info-box blue-info">
              <IonIcon icon={informationCircleOutline} />
              <div>
                <h3>Protección de Datos según Ley 19.628</h3>
                <p>
                  Esta herramienta detecta automáticamente datos personales sensibles como RUT,
                  direcciones, teléfonos y correos electrónicos en documentos oficiales,
                  ayudándote a cumplir con la normativa de protección de datos.
                </p>
              </div>
            </div>
          </div>

        </IonContent>
      </AdminLayout>
    </IonPage>
  );
};

export default ValidadorDocumentos;