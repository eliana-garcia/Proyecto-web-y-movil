import React, { useState, useEffect } from 'react';

import {
  IonPage,
  IonIcon,
  useIonToast
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

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const Agenda: React.FC = () => {
  const [presentToast] = useIonToast();

  const hoy = new Date();
  // Normalizar 'hoy' a medianoche para comparaciones exactas
  hoy.setHours(0, 0, 0, 0);

  const [fechaActual, setFechaActual] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  const [diaSeleccionado, setDiaSeleccionado] = useState(hoy.getDate());
  
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  
  // Simulando base de datos de citas: { 'YYYY-MM-DD': ['09:00', '10:30'] }
  const [citasReservadas, setCitasReservadas] = useState<Record<string, string[]>>({
    '2026-6-15': ['10:00', '14:30'] // Datos de ejemplo para pruebas
  });

  // Genera clave única para el día seleccionado (YYYY-M-D)
  const getFechaKey = (dia: number) => {
    return `${fechaActual.getFullYear()}-${fechaActual.getMonth() + 1}-${dia}`;
  };

  const fechaKeySeleccionada = getFechaKey(diaSeleccionado);

  const esPasado = (dia: number) => {
    const fechaEvaluada = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia);
    return fechaEvaluada < hoy;
  };

  // Efecto para asegurar que seleccionamos el día actual o el día 1, y limpiar la hora
  useEffect(() => {
    setHoraSeleccionada(null);
    if (fechaActual.getMonth() === hoy.getMonth() && fechaActual.getFullYear() === hoy.getFullYear()) {
      setDiaSeleccionado(hoy.getDate());
    } else {
      setDiaSeleccionado(1);
    }
  }, [fechaActual]);

  // Limpiar hora si cambias de día
  useEffect(() => {
    setHoraSeleccionada(null);
  }, [diaSeleccionado]);

  const irMesAnterior = () => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1));
  };

  const irMesSiguiente = () => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1));
  };

  const seleccionarHora = (hora: string) => {
    setHoraSeleccionada(hora);
  };

  const confirmarReserva = () => {
    if (!horaSeleccionada) return;

    // Verificar si ya está reservada (doble check)
    const horasOcupadas = citasReservadas[fechaKeySeleccionada] || [];
    if (horasOcupadas.includes(horaSeleccionada)) {
      presentToast({
        message: 'Esta hora ya no está disponible.',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      setHoraSeleccionada(null);
      return;
    }

    // Guardar reserva
    setCitasReservadas(prev => ({
      ...prev,
      [fechaKeySeleccionada]: [...(prev[fechaKeySeleccionada] || []), horaSeleccionada]
    }));

    presentToast({
      message: `Cita reservada con éxito para el ${diaSeleccionado} de ${meses[fechaActual.getMonth()]} a las ${horaSeleccionada}.`,
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    
    setHoraSeleccionada(null);
  };

  // Lógica del calendario
  const diasEnMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
  const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay(); // 0 (Dom) a 6 (Sáb)

  // Crear array con espacios vacíos para alinear el día 1 en la columna correcta
  const diasArray = (Array.from({ length: primerDiaSemana }, () => null) as (number | null)[]).concat(
    Array.from({ length: diasEnMes }, (_, i) => i + 1)
  );

  return (
    <IonPage>
      <AdminLayout>
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
                <h2 style={{margin: 0, fontSize: '24px', fontWeight: 600}}>
                  {meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
                </h2>
                <div>
                  <button className="nav-btn" onClick={irMesAnterior}>
                    <IonIcon icon={chevronBackOutline} />
                  </button>
                  <button className="nav-btn" onClick={irMesSiguiente}>
                    <IonIcon icon={chevronForwardOutline} />
                  </button>
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
                {diasArray.map((d, index) => {
                  const isPasado = d ? esPasado(d) : false;
                  return (
                    <div key={index} className="day-cell">
                      {d !== null && (
                        <button
                          className={`
                            ${diaSeleccionado === d ? 'selected-day' : ''}
                            ${isPasado ? 'past-day' : ''}
                          `}
                          onClick={() => !isPasado && setDiaSeleccionado(d)}
                          disabled={isPasado}
                        >
                          {d}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="schedule-card schedule-flex">
              <div>
                <h2 style={{margin: '0 0 10px', fontSize: '22px', fontWeight: 600}}>
                  <IonIcon icon={timeOutline} style={{marginRight: '8px'}} />
                  Horarios Disponibles
                </h2>

                <p style={{marginBottom: '20px'}}>
                  Selecciona un horario para el {diaSeleccionado} de {meses[fechaActual.getMonth()]} de {fechaActual.getFullYear()}
                </p>

                <div className="time-grid-container">
                  <div className="time-grid">
                    {horarios.map((hora) => {
                      const horasOcupadas = citasReservadas[fechaKeySeleccionada] || [];
                      const isOcupada = horasOcupadas.includes(hora);
                      const isSeleccionada = horaSeleccionada === hora;

                      return (
                        <button 
                          key={hora} 
                          onClick={() => !isOcupada && seleccionarHora(hora)} 
                          disabled={isOcupada}
                          className={`
                            time-btn 
                            ${isOcupada ? 'booked-time' : ''}
                            ${isSeleccionada ? 'selected-time' : ''}
                          `}
                        >
                          {hora}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="schedule-footer">
                 <button 
                    className="book-btn" 
                    disabled={!horaSeleccionada}
                    onClick={confirmarReserva}
                  >
                    Agendar Cita {horaSeleccionada ? `a las ${horaSeleccionada}` : ''}
                 </button>
              </div>
            </div>
          </div>

        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default Agenda;