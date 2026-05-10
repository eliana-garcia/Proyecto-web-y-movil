import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface RoutePrivateProps extends RouteProps {
  component: React.ComponentType<any>;
}

const RoutePrivate: React.FC<RoutePrivateProps> = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const isAuthenticated = !!localStorage.getItem('token');

        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/Login" />
        );
      }}
    />
  );
};

export default RoutePrivate;