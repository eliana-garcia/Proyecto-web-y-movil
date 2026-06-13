import React, { useState } from 'react';
import { IonPage, IonButton, IonIcon, IonInput } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline, alertCircleOutline, searchOutline, linkOutline } from 'ionicons/icons';

import AdminLayout from '../components/AdminLayout';
import './ValidadorDominios.css';

const ValidadorDominios: React.FC = () => {
  const [urlPersonalizada, setUrlPersonalizada] = useState('');
  const [resultadoPersonalizado, setResultadoPersonalizado] = useState<{ seguro: boolean | null, mensaje: string } | null>(null);

  const analizarUrl = () => {
    if (!urlPersonalizada.trim()) {
      setResultadoPersonalizado(null);
      return;
    }

    const urlLower = urlPersonalizada.toLowerCase().trim();

    // Lógica heurística básica
    if (urlLower.startsWith('http://')) {
      setResultadoPersonalizado({ seguro: false, mensaje: 'No es seguro. Falta certificado HTTPS.' });
    } else if (urlLower.endsWith('.gob.cl') || urlLower.includes('.gob.cl/')) {
      setResultadoPersonalizado({ seguro: true, mensaje: 'Seguro. Es un dominio gubernamental oficial.' });
    } else if (urlLower.includes('login') || urlLower.includes('update') || urlLower.includes('secure') || urlLower.includes('banco')) {
      if (!urlLower.endsWith('.cl') && !urlLower.endsWith('.com')) {
         setResultadoPersonalizado({ seguro: false, mensaje: 'Sospechoso. Intenta suplantar un servicio oficial.' });
      } else {
         setResultadoPersonalizado({ seguro: false, mensaje: 'Precaución. Verifica bien la procedencia del enlace.' });
      }
    } else if (!urlLower.includes('.')) {
      setResultadoPersonalizado({ seguro: false, mensaje: 'URL inválida. Falta extensión de dominio.' });
    } else {
      setResultadoPersonalizado({ seguro: null, mensaje: 'Dominio genérico. Navega con precaución y verifica el candado HTTPS.' });
    }
  };

  return (
    <IonPage>
      <AdminLayout>
        <div className="admin-content">
          <div className="layout-single-validador">
            <section className="domain-header">
              <div>
                <h1>Validación de Dominios</h1>
                <p>Analizador de enlaces sospechosos</p>
              </div>
              <div className="header-icon blue-bg">
                <IonIcon icon={searchOutline} />
              </div>
            </section>

            <section className="custom-validator-panel">
              <div className="custom-validator-header">
                <IonIcon icon={searchOutline} />
                <h2>Analizador de Enlaces</h2>
              </div>
              <p>Pega un enlace o dominio que te parezca sospechoso para obtener un análisis rápido de su nivel de riesgo.</p>

              <div className="custom-input-box">
                <IonIcon icon={linkOutline} />
                <IonInput 
                  placeholder="Ej: https://chileatiende.gob.cl" 
                  value={urlPersonalizada}
                  onIonInput={(e) => setUrlPersonalizada(String(e.detail.value))}
                  onKeyDown={(e) => { if(e.key === 'Enter') analizarUrl(); }}
                />
                <IonButton onClick={analizarUrl}>Analizar URL</IonButton>
              </div>

              {resultadoPersonalizado && (
                <div className={`result-box ${resultadoPersonalizado.seguro === true ? 'safe' : resultadoPersonalizado.seguro === false ? 'danger' : 'warning'}`}>
                  <IonIcon icon={resultadoPersonalizado.seguro === true ? checkmarkCircleOutline : resultadoPersonalizado.seguro === false ? closeCircleOutline : alertCircleOutline} />
                  <div>
                    <strong>{resultadoPersonalizado.seguro === true ? 'Sitio Seguro' : resultadoPersonalizado.seguro === false ? 'Posible Riesgo' : 'Precaución'}</strong>
                    <p>{resultadoPersonalizado.mensaje}</p>
                  </div>
                </div>
              )}
            </section>

            <section className="tips-box">
              <IonIcon icon={alertCircleOutline} />
              <div>
                <strong>Consejos de Seguridad</strong>
                <p>• Los sitios oficiales del gobierno chileno usan .gob.cl</p>
                <p>• Verifica siempre el candado de seguridad (HTTPS) en la barra de direcciones</p>
                <p>• Desconfía de URLs con errores ortográficos o dominios sospechosos</p>
                <p>• Nunca ingreses datos personales en sitios que no terminen en .gob.cl</p>
              </div>
            </section>
          </div>
        </div>
      </AdminLayout>
    </IonPage>
  );
};

export default ValidadorDominios;