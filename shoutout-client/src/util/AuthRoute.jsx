import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";

const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            authenticated === true ? (
                <Redirect to="/" />
            ) : (
                <Component {...props} />
            )
        }
    />
);

export default AuthRoute;
