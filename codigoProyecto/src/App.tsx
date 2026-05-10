import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

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
          <Route exact path="/Login" component={Login} />
          <Route exact path="/LoginClaveUnica" component={LoginClaveUnica} />
          <Route exact path="/Registro" component={Registro} />

          <Route exact path="/DashBoardAdmin" component={DashBoardAdmin} />
          <Route exact path="/Capacitacion" component={Capacitacion} />
          <Route exact path="/Evaluacion" component={Evaluacion} />
          <Route exact path="/ValidadorDominios" component={ValidadorDominios} />
          <Route exact path="/ReportarIncidente" component={ReportarIncidente} />
          <Route exact path="/HistorialReportes" component={HistorialReportes} />
          <Route exact path="/ValidadorDocumentos" component={ValidadorDocumentos} />
          <Route exact path="/Estadisticas" component={Estadisticas} />
          <Route exact path="/Agenda" component={Agenda} />
          <Route exact path="/GestionUsuarios" component={GestionUsuarios} />

          <Route exact path="/">
            <Redirect to="/Login" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;