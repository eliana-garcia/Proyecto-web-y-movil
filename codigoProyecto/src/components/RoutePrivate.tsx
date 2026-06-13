import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface RoutePrivateProps extends RouteProps {
  component: React.ComponentType<any>;
  isAdminOnly?: boolean;
}

const RoutePrivate: React.FC<RoutePrivateProps> = ({
  component: Component,
  isAdminOnly,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const isAuthenticated = !!localStorage.getItem('token');
        const userRole = localStorage.getItem('rol');

        if (!isAuthenticated) {
          return <Redirect to="/Login" />;
        }

        if (isAdminOnly && userRole !== '1') {
          return <Redirect to="/Capacitacion" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default RoutePrivate;