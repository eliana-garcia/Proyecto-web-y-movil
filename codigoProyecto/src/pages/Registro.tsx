import React, { useState } from 'react';
import { registrarUsuario } from '../services/authService';

import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
  useIonRouter
} from '@ionic/react';

import {
  shieldOutline,
  personAddOutline,
  arrowBackOutline
} from 'ionicons/icons';

import './Registro.css';

const Registro: React.FC = () => {
  const router = useIonRouter();

  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const [form, setForm] = useState({
    usuario: '',
    rut: '',
    correo: '',
    region: '',
    comuna: '',
    password: '',
    confirmarPassword: ''
  });

  const cambiarValor = (campo: string, valor: string) => {
    setForm({
      ...form,
      [campo]: valor
    });
  };

  const manejarRegistro = async () => {
    if (
      !form.usuario ||
      !form.rut ||
      !form.correo ||
      !form.region ||
      !form.comuna ||
      !form.password ||
      !form.confirmarPassword
    ) {
      alert('Debes completar todos los campos.');
      return;
    }

    if (form.password !== form.confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (!aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    try {

  const {
    response,
    data
  } = await registrarUsuario(
    form.usuario,
    form.rut,
    form.correo,
    form.region,
    form.comuna,
    form.password
  );

  if (!response.ok) {
    alert(data.mensaje || 'Error al registrar usuario');
    return;
  }

  alert('Usuario registrado correctamente.');
  router.push('/Login', 'back');

} catch (error) {

  console.error('Error:', error);

  alert('No fue posible conectar con el servidor.');
} 
  };

  return (
    <IonPage>
      <IonContent fullscreen className="registro-content">
        <div className="registro-wrapper">
          <div className="registro-card">

            <button
              className="registro-back"
              onClick={() => router.push('/Login', 'back')}
            >
              <IonIcon icon={arrowBackOutline} />
              Volver
            </button>

            <div className="registro-icon">
              <IonIcon icon={shieldOutline} />
            </div>

            <h1>Registro de Usuario</h1>
            <p className="registro-subtitle">
              Complete el formulario para acceder
            </p>

            <div className="registro-grid">

              <div className="registro-group">
                <label>
                  Nombre de Usuario <span>*</span>
                </label>
                <IonInput
                  value={form.usuario}
                  onIonInput={(e) =>
                    cambiarValor('usuario', String(e.detail.value))
                  }
                  className="registro-input"
                />
              </div>

              <div className="registro-group">
                <label>
                  RUT <span>*</span>
                </label>
                <IonInput
                  value={form.rut}
                  onIonInput={(e) =>
                    cambiarValor('rut', String(e.detail.value))
                  }
                  placeholder="12.345.678-9"
                  className="registro-input"
                />
              </div>

              <div className="registro-group full">
                <label>
                  Correo Electrónico <span>*</span>
                </label>
                <IonInput
                  value={form.correo}
                  onIonInput={(e) =>
                    cambiarValor('correo', String(e.detail.value))
                  }
                  type="email"
                  placeholder="usuario@ejemplo.cl"
                  className="registro-input"
                />
              </div>

              <div className="registro-group">
                <label>
                  Región <span>*</span>
                </label>
                <IonInput
                  value={form.region}
                  onIonInput={(e) =>
                    cambiarValor('region', String(e.detail.value))
                  }
                  className="registro-input"
                />
              </div>

              <div className="registro-group">
                <label>
                  Comuna <span>*</span>
                </label>
                <IonInput
                  value={form.comuna}
                  onIonInput={(e) =>
                    cambiarValor('comuna', String(e.detail.value))
                  }
                  className="registro-input"
                />
              </div>

              <div className="registro-group">
                <label>
                  Contraseña <span>*</span>
                </label>
                <IonInput
                  value={form.password}
                  onIonInput={(e) =>
                    cambiarValor('password', String(e.detail.value))
                  }
                  type="password"
                  className="registro-input"
                />
              </div>

              <div className="registro-group">
                <label>
                  Confirmar Contraseña <span>*</span>
                </label>
                <IonInput
                  value={form.confirmarPassword}
                  onIonInput={(e) =>
                    cambiarValor(
                      'confirmarPassword',
                      String(e.detail.value)
                    )
                  }
                  type="password"
                  className="registro-input"
                />
              </div>

            </div>

            <div className="terms-box">
              <IonCheckbox
                checked={aceptaTerminos}
                onIonChange={(e) =>
                  setAceptaTerminos(e.detail.checked)
                }
              />

              <p>
                Acepto los términos y condiciones de tratamiento de
                datos según
                <strong>
                  {' '}Ley 19.628 de Protección de Datos Personales{' '}
                </strong>
                y autorizo el uso de mis datos para fines de
                seguridad informática municipal.
              </p>
            </div>

            <IonButton
              expand="block"
              className="registro-btn"
              onClick={manejarRegistro}
            >
              <IonIcon icon={personAddOutline} slot="start" />
              Registrarse
            </IonButton>

            <p className="login-link">
              ¿Ya tienes una cuenta?
              <span onClick={() => router.push('/Login', 'back')}>
                {' '}Inicia sesión aquí
              </span>
            </p>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registro;