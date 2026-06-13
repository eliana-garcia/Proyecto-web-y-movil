import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  useIonToast
} from '@ionic/react';

import { useHistory, useParams } from 'react-router-dom';
import { API_URL } from '../services/api';
import chileData from '../data/regiones.json';

const EditarUsuario: React.FC = () => {

  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [comunas, setComunas] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [presentToast] = useIonToast();

  useEffect(() => {
    if (region) {
      const regionObj = chileData.regiones.find(r => r.region === region);
      setComunas(regionObj ? regionObj.comunas : []);
    }
  }, [region]);

  useEffect(() => {

    const cargarUsuario = async () => {

      const token = localStorage.getItem('token');

      try {

        const response = await fetch(
          `${API_URL}/api/usuarios/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        setNombre(data.nombre_usuario || '');
        setCorreo(data.correo || '');
        setRegion(data.region || '');
        setComuna(data.comuna || '');

      } catch (error) {

        console.error(error);

        presentToast({
          message: 'Error al cargar usuario',
          duration: 2000,
          color: 'danger'
        });

      } finally {

        setLoading(false);

      }
    };

    cargarUsuario();

  }, [id, presentToast]);

  const guardarCambios = async () => {

    if (!nombre || !correo || !region || !comuna) {

      presentToast({
        message: 'Debe completar todos los campos',
        duration: 2000,
        color: 'warning'
      });

      return;
    }

    const token = localStorage.getItem('token');

    try {

      const response = await fetch(
        `${API_URL}/api/usuarios/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            nombre_usuario: nombre,
            correo,
            region,
            comuna
          })
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      presentToast({
        message: 'Usuario actualizado correctamente',
        duration: 2000,
        color: 'success'
      });

      history.push('/GestionUsuarios');

    } catch (error) {

      console.error(error);

      presentToast({
        message: 'No se pudo actualizar el usuario',
        duration: 2000,
        color: 'danger'
      });

    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">

        <h1>Editar Usuario</h1>

        {loading ? (

          <div style={{ textAlign: 'center', padding: '30px' }}>
            <IonSpinner />
          </div>

        ) : (

          <>
            <IonInput
              placeholder="Nombre"
              value={nombre}
              onIonInput={(e) => setNombre(String(e.detail.value))}
            />

            <IonInput
              placeholder="Correo"
              value={correo}
              onIonInput={(e) => setCorreo(String(e.detail.value))}
            />

            <IonSelect
              placeholder="Región"
              value={region}
              onIonChange={(e) => {
                setRegion(e.detail.value);
                setComuna('');
              }}
              interface="popover"
            >
              {chileData.regiones.map((r) => (
                <IonSelectOption key={r.region} value={r.region}>
                  {r.region}
                </IonSelectOption>
              ))}
            </IonSelect>

            <IonSelect
              placeholder="Comuna"
              value={comuna}
              onIonChange={(e) => setComuna(e.detail.value)}
              disabled={!region}
              interface="popover"
            >
              {comunas.map((c) => (
                <IonSelectOption key={c} value={c}>
                  {c}
                </IonSelectOption>
              ))}
            </IonSelect>

            <IonButton
              expand="block"
              onClick={guardarCambios}
            >
              Guardar Cambios
            </IonButton>
          </>

        )}

      </IonContent>
    </IonPage>
  );
};

export default EditarUsuario;