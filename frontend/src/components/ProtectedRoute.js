import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, user, ...rest }) => {
  useEffect(() => {
    return () => {};
  }, [user]);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          return <Component {...rest} {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/unauthorized",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
