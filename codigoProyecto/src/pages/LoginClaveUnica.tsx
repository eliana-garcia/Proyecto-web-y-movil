import React, { useState } from 'react';

import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  useIonRouter,
  useIonToast
} from '@ionic/react';

import {
  keyOutline,
  eyeOutline,
  arrowBackOutline
} from 'ionicons/icons';

import './LoginClaveUnica.css';

const LoginClaveUnica: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const [run, setRun] = useState('');
  const [clave, setClave] = useState('');

  const ingresarClaveUnica = () => {
    if (!run || !clave) {
      presentToast({
        message: 'Debes ingresar RUN y ClaveÚnica.',
        duration: 2000,
        color: 'warning'
      });
      return;
    }

    localStorage.setItem('token', 'usuario_autenticado');
    router.push('/DashBoardAdmin', 'forward');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="clave-content">
        <div className="clave-wrapper">
          <div className="clave-card">

            <button className="back-button" onClick={() => router.push('/Login', 'back')}>
              <IonIcon icon={arrowBackOutline} />
              Volver
            </button>

            <div className="clave-icon">
              <IonIcon icon={keyOutline} />
            </div>

            <h1>Portal Ciudadano ClaveÚnica</h1>
            <p className="clave-subtitle">Ingresa con tu Clave Única</p>

            <div className="clave-group">
              <label>RUN</label>
              <IonInput
                value={run}
                onIonInput={(e) => setRun(String(e.detail.value))}
                placeholder="12.345.678-9"
                className="clave-input"
              />
            </div>

            <div className="clave-group">
              <label>ClaveÚnica</label>
              <div className="password-box">
                <IonInput
                  value={clave}
                  onIonInput={(e) => setClave(String(e.detail.value))}
                  type="password"
                  placeholder="••••••••"
                  className="clave-input password-input"
                />
                <IonIcon icon={eyeOutline} />
              </div>
            </div>

            <div className="clave-links">
              <p>Recupera tu ClaveÚnica</p>
              <p>Solicita tu ClaveÚnica</p>
            </div>

            <IonButton expand="block" className="clave-btn" onClick={ingresarClaveUnica}>
              <IonIcon icon={keyOutline} slot="start" />
              Ingresar con Clave Única
            </IonButton>

            <p className="help-text">¿Necesitas ayuda?</p>

            <div className="clave-footer">
              Protegido bajo Ley 19.628 de Protección de Datos Personales
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginClaveUnica;