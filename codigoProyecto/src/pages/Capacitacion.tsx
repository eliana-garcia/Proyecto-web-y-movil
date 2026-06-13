import React, { useState } from 'react';
import { IonPage, IonIcon, IonButton } from '@ionic/react';
import { playOutline, checkmarkCircleOutline, lockClosedOutline, timeOutline } from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';
import './Capacitacion.css';

const modulos = [
  { titulo: 'Identificación de Phishing', desc: 'Aprende a reconocer correos electrónicos fraudulentos y enlaces maliciosos', min: '25 min', estado: 'Completado', progreso: 100 },
  { titulo: 'Gestión de Contraseñas', desc: 'Mejores prácticas para crear y mantener contraseñas seguras', min: '20 min', estado: 'Completado', progreso: 100 },
  { titulo: 'Protección de Datos Personales', desc: 'Cumplimiento de la Ley 19.628 y manejo de información sensible', min: '30 min', estado: 'En progreso', progreso: 60 },
  { titulo: 'Navegación Segura en Internet', desc: 'Identifica sitios web seguros y evita descargas peligrosas', min: '22 min', estado: 'No iniciado', progreso: 0 },
  { titulo: 'Seguridad en Redes WiFi', desc: 'Riesgos de redes públicas y configuración de conexiones seguras', min: '18 min', estado: 'Bloqueado', progreso: 0 }
];

const Capacitacion: React.FC = () => {
  const [actual, setActual] = useState(modulos[2]);

  return (
  <IonPage>
    <AdminLayout>
      <div className="training-layout">
        <section>
          <h2 className="section-title">Módulos Disponibles</h2>

          <div className="module-list">
            {modulos.map((m) => (
              <div
                key={m.titulo}
                className={actual.titulo === m.titulo ? 'module-card selected' : 'module-card'}
                onClick={() => setActual(m)}
              >
                <div>
                  <h3>{m.titulo}</h3>
                  <p>{m.desc}</p>
                  <small>{m.min}</small>
                </div>

                {m.estado === 'Completado' && <IonIcon icon={checkmarkCircleOutline} className="ok" />}
                {m.estado === 'Bloqueado' && <IonIcon icon={lockClosedOutline} className="locked" />}
                {m.estado === 'En progreso' && <IonIcon icon={timeOutline} className="orange-text" />}

                <span>{m.estado}</span>

                {m.progreso > 0 && (
                  <div className="progress">
                    <span style={{ width: `${m.progreso}%` }}></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="video-panel">
          <h2>{actual.titulo}</h2>

          <div className="video-box">
            <IonIcon icon={playOutline} />
            <p>Continuar desde el minuto 18</p>
          </div>

          <div className="progress-label">
            <p>Progreso del módulo</p>
            <strong>{actual.progreso}%</strong>
          </div>

          <div className="progress">
            <span style={{ width: `${actual.progreso}%` }}></span>
          </div>

          <h3>Descripción</h3>
          <p>{actual.desc}</p>

          <div className="info-grid">
            <div>
              <small>Duración</small>
              <strong>{actual.min}</strong>
            </div>

            <div>
              <small>Estado</small>
              <strong>{actual.estado}</strong>
            </div>
          </div>

          <div className="warning-box">
            <strong>Módulo Obligatorio</strong>
            <p>
              Este módulo es requerido para cumplir con la Ley 19.628 de Protección de Datos Personales.
            </p>
          </div>

          <IonButton expand="block">Continuar Capacitación</IonButton>
        </section>
      </div>
    </AdminLayout>
  </IonPage>
);
};

export default Capacitacion;