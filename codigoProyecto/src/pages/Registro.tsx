import React, { useState } from 'react';
import { registrarUsuario } from '../services/authService';
import { formatRUT } from '../services/formatUtils';

import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  useIonRouter,
  useIonToast
} from '@ionic/react';

import {
  shieldOutline,
  personAddOutline,
  arrowBackOutline
} from 'ionicons/icons';

import './Registro.css';
import chileData from '../data/regiones.json';

const Registro: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();
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

  const [comunas, setComunas] = useState<string[]>([]);

  const cambiarValor = (campo: string, valor: string) => {
    setForm(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleRegionChange = (regionName: string) => {
    const regionObj = chileData.regiones.find(r => r.region === regionName);
    const nuevasComunas = regionObj ? regionObj.comunas : [];
    
    setComunas(nuevasComunas);
    
    setForm(prev => ({
      ...prev,
      region: regionName,
      comuna: ''
    }));
  };
  const mostrarMensaje = (
    mensaje: string,
    color: string = 'primary'
  ) => {
    presentToast({
      message: mensaje,
      duration: 2500,
      position: 'top',
      color
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
      mostrarMensaje(
        'Debes completar todos los campos.',
        'warning'
      );
      return;
    }

    if (form.password !== form.confirmarPassword) {
      mostrarMensaje(
        'Las contraseñas no coinciden.',
        'danger'
      );
      return;
    }

    if (!aceptaTerminos) {
      mostrarMensaje(
        'Debes aceptar los términos y condiciones.',
        'danger'
      );
      return;
    }

    try {

  await registrarUsuario(
    form.usuario,
    form.rut,
    form.correo,
    form.region,
    form.comuna,
    form.password
  );

  mostrarMensaje(
    'Usuario registrado correctamente.',
    'success'
  );
  router.push('/Login', 'back');

} catch (error: any) {

  console.error('ERROR COMPLETO:', error);

  mostrarMensaje(
    error.message || String(error),
    'danger'
  );
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
                    cambiarValor('rut', formatRUT(String(e.detail.value)))
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
                <IonSelect
                  value={form.region}
                  placeholder="Seleccione Región"
                  onIonChange={(e) => handleRegionChange(e.detail.value)}
                  className="registro-input"
                  interface="popover"
                >
                  {chileData.regiones.map((r) => (
                    <IonSelectOption key={r.region} value={r.region}>
                      {r.region}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>

              <div className="registro-group">
                <label>
                  Comuna <span>*</span>
                </label>
                <IonSelect
                  value={form.comuna}
                  placeholder="Seleccione Comuna"
                  onIonChange={(e) => cambiarValor('comuna', e.detail.value)}
                  disabled={!form.region}
                  className="registro-input"
                  interface="popover"
                >
                  {comunas.map((c) => (
                    <IonSelectOption key={c} value={c}>
                      {c}
                    </IonSelectOption>
                  ))}
                </IonSelect>
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