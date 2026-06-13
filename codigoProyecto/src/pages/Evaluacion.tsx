import React from 'react';
import { IonPage ,IonButton, IonIcon } from '@ionic/react';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const Evaluacion: React.FC = () => {
  return (
    <IonPage>
    <AdminLayout>
      <section className="header-panel">
        <h1>Evaluación de Conocimientos</h1>
        <p>Valida tu aprendizaje y obtén tu registro de cumplimiento</p>
      </section>

      <section className="test-grid">
        <div className="test-card active-test">
          <div className="test-top">
            <h3>Test: Identificación de Phishing</h3>
            <span><IonIcon icon={timeOutline} /> 15 min</span>
          </div>

          <p>Módulo 1</p>

          <div className="test-info">
            <strong>5 preguntas</strong>
            <small>Puntaje mínimo para aprobar: 70%</small>
          </div>

          <IonButton expand="block">
            Iniciar Test
            <IonIcon icon={arrowForwardOutline} slot="end" />
          </IonButton>
        </div>

        <div className="test-card">
          <div className="test-top">
            <h3>Test: Gestión de Contraseñas</h3>
            <span><IonIcon icon={timeOutline} /> 12 min</span>
          </div>

          <p>Módulo 2</p>

          <div className="test-info">
            <strong>5 preguntas</strong>
            <small>Puntaje mínimo para aprobar: 70%</small>
          </div>
        </div>
      </section>
    </AdminLayout>
    </IonPage>
  );
};

export default Evaluacion;