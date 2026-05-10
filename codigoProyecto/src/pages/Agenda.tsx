import React, { useState } from 'react';

import {
  IonPage,
  IonContent,
  IonIcon
} from '@ionic/react';

import {
  calendarOutline,
  timeOutline,
  chevronBackOutline,
  chevronForwardOutline
} from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';

const horarios = [
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30'
];

const Agenda: React.FC = () => {
  const [dia, setDia] = useState(1);
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <IonPage>
      <AdminLayout active="Agenda">
        <div className="admin-content">
          <div className="page-header-card agenda-title">
            <div className="header-left">
              <div className="mini-icon blue-bg">
                <IonIcon icon={calendarOutline} />
              </div>

              <div>
                <h1>Agenda de Consultas Técnicas</h1>
                <p>Reserva una cita con el equipo de TI para soporte técnico</p>
              </div>
            </div>
          </div>

          <div className="agenda-layout">
            <div className="calendar-card">
              <div className="calendar-head">
                <h2>Mayo 2026</h2>
                <div>
                  <IonIcon icon={chevronBackOutline} />
                  <IonIcon icon={chevronForwardOutline} />
                </div>
              </div>

              <div className="week-days">
                <span>Dom</span>
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
              </div>

              <div className="month-grid">
                {dias.map((d) => (
                  <button
                    key={d}
                    className={dia === d ? 'selected-day' : ''}
                    onClick={() => setDia(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="schedule-card">
              <h2>
                <IonIcon icon={timeOutline} />
                Horarios Disponibles
              </h2>

              <p>Selecciona un horario para el {dia} de Mayo de 2026</p>

              <div className="time-grid">
                {horarios.map((hora) => (
                  <button key={hora}>{hora}</button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default Agenda;