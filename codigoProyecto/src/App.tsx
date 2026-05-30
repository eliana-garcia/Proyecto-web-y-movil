import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import RoutePrivate from './components/RoutePrivate';

import Login from './pages/Login';
import LoginClaveUnica from './pages/LoginClaveUnica';
import Registro from './pages/Registro';

import DashBoardAdmin from './pages/DashBoardAdmin';
import Capacitacion from './pages/Capacitacion';
import Evaluacion from './pages/Evaluacion';
import ValidadorDominios from './pages/ValidadorDominios';
import ReportarIncidente from './pages/ReportarIncidente';
import HistorialReportes from './pages/HistorialReportes';
import ValidadorDocumentos from './pages/ValidadorDocumentos';
import Estadisticas from './pages/Estadisticas';
import Agenda from './pages/Agenda';
import GestionUsuarios from './pages/GestionUsuarios';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>

          {/* PUBLICAS */}
          <Route exact path="/Login" component={Login} />
          <Route exact path="/LoginClaveUnica" component={LoginClaveUnica} />
          <Route exact path="/Registro" component={Registro} />

          {/* PRIVADAS (PROTEGIDAS) */}
          <RoutePrivate exact path="/DashBoardAdmin" component={DashBoardAdmin} />
          <RoutePrivate exact path="/Capacitacion" component={Capacitacion} />
          <RoutePrivate exact path="/Evaluacion" component={Evaluacion} />
          <RoutePrivate exact path="/ValidadorDominios" component={ValidadorDominios} />
          <RoutePrivate exact path="/ReportarIncidente" component={ReportarIncidente} />
          <RoutePrivate exact path="/HistorialReportes" component={HistorialReportes} />
          <RoutePrivate exact path="/ValidadorDocumentos" component={ValidadorDocumentos} />
          <RoutePrivate exact path="/Estadisticas" component={Estadisticas} />
          <RoutePrivate exact path="/Agenda" component={Agenda} />
          <RoutePrivate exact path="/GestionUsuarios" component={GestionUsuarios} />

          {/* DEFAULT */}
          <Route exact path="/">
            <Redirect to="/Login" />
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;