import React, { useState } from 'react';
import { IonPage, IonButton, IonIcon } from '@ionic/react';
import { shieldOutline, checkmarkCircleOutline, closeCircleOutline, alertCircleOutline } from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const casos = [
  { dominio: 'municipalidad-tramites.com', seguro: false },
  { dominio: 'chileatiende.gob.cl', seguro: true },
  { dominio: 'banco-estado-seguro.net', seguro: false },
  { dominio: 'municipalidad.gob.cl', seguro: true },
  { dominio: 'claveunica-login.com', seguro: false }
];

const ValidadorDominios: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [correctas, setCorrectas] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);

  const responder = (respuesta: boolean) => {
    if (respuesta === casos[index].seguro) {
      setCorrectas(correctas + 1);
    } else {
      setIncorrectas(incorrectas + 1);
    }

    if (index < casos.length - 1) {
      setIndex(index + 1);
    }
  };

  const intentos = correctas + incorrectas;
  const precision = intentos === 0 ? 0 : Math.round((correctas / intentos) * 100);

  return (
    <IonPage>
    <AdminLayout>
      <section className="domain-header">
        <div>
          <h1>Validación de Dominios</h1>
          <p>Identifica sitios web seguros</p>
        </div>
        <div className="precision">
          <strong>{precision}%</strong>
          <span>Precisión</span>
        </div>
      </section>

      <section className="mini-stats">
        <div><p>Intentos</p><strong>{intentos}</strong></div>
        <div><p>Correctas</p><strong className="green-text">{correctas}</strong></div>
        <div><p>Incorrectas</p><strong className="red-text">{incorrectas}</strong></div>
      </section>

      <section className="validator-panel">
        <p>Caso {index + 1} de {casos.length}</p>

        <div className="progress">
          <span style={{ width: `${((index + 1) / casos.length) * 100}%` }}></span>
        </div>

        <h3>¿Es este un sitio web seguro?</h3>

        <div className="domain-box">
          <IonIcon icon={shieldOutline} />
          <strong>{casos[index].dominio}</strong>
        </div>

        <div className="answer-grid">
          <IonButton className="safe-btn" onClick={() => responder(true)}>
            <IonIcon icon={checkmarkCircleOutline} slot="start" />
            Seguro
          </IonButton>

          <IonButton className="danger-btn" onClick={() => responder(false)}>
            <IonIcon icon={closeCircleOutline} slot="start" />
            No Seguro
          </IonButton>
        </div>

        <div className="tips-box">
          <IonIcon icon={alertCircleOutline} />
          <div>
            <strong>Consejos de Seguridad</strong>
            <p>• Los sitios oficiales del gobierno chileno usan .gob.cl</p>
            <p>• Verifica siempre el candado de seguridad HTTPS</p>
            <p>• Desconfía de URLs con errores ortográficos o dominios sospechosos</p>
          </div>
        </div>
      </section>
    </AdminLayout>
    </IonPage>
  );
};

export default ValidadorDominios;