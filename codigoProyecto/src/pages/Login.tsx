import React, { useState } from 'react';

import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  useIonRouter
} from '@ionic/react';

import {
  shieldOutline,
  logInOutline,
  keyOutline
} from 'ionicons/icons';

import './Login.css';

const Login: React.FC = () => {
  const router = useIonRouter();

  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');

 const iniciarSesion = async () => {
  if (!rut || !password) {
    alert('Debes ingresar RUT y contraseña.');
    return;
  }

  try {
    const response = await fetch(
      'http://localhost:3000/api/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rut,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.mensaje);
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('rol', String(data.rol));

    router.push('/DashBoardAdmin', 'root', 'replace');

  } catch (error) {
    console.error(error);
    alert('Error al conectar con el servidor');
  }
};

  return (
    <IonPage>
      <IonContent fullscreen className="auth-content">
        <div className="auth-wrapper">
          <div className="login-card">

            <div className="auth-icon">
              <IonIcon icon={shieldOutline} />
            </div>

            <h1>CiberSeguridad Municipal</h1>
            <p className="subtitle">Inicia sesión para acceder</p>

            <div className="form-group">
              <label>RUT</label>
              <IonInput
                value={rut}
                onIonInput={(e) => setRut(String(e.detail.value))}
                placeholder="12.345.678-9"
                className="custom-input"
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <IonInput
                value={password}
                onIonInput={(e) => setPassword(String(e.detail.value))}
                type="password"
                placeholder="••••••••"
                className="custom-input"
              />
            </div>

            <IonButton expand="block" className="primary-btn" onClick={iniciarSesion}>
              <IonIcon icon={logInOutline} slot="start" />
              Iniciar Sesión
            </IonButton>

            <div className="divider">
              <span></span>
              <p>o</p>
              <span></span>
            </div>

            <IonButton
              expand="block"
              className="red-btn"
              onClick={() => router.push('/LoginClaveUnica', 'forward')}
            >
              <IonIcon icon={keyOutline} slot="start" />
              Ingresar con Clave Única
            </IonButton>

            <p className="register-text">
              ¿No tienes una cuenta?
              <span onClick={() => router.push('/Registro', 'forward')}>
                {' '}Regístrate aquí
              </span>
            </p>

            <div className="footer-text">
              Protegido bajo Ley 19.628 de Protección de Datos Personales
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;