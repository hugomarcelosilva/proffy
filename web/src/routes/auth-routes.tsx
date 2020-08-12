import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import ForgotPassword from '../pages/ForgotPassword';
import ForgotPasswordSuccess from '../pages/ForgotPassword/ForgotPasswordSuccess';
import ResetPassword from '../pages/ResetPassword';
import ResetPasswordSuccess from '../pages/ResetPassword/ResetPasswordSuccess';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import SignUpSuccess from '../pages/SignUp/SignUpSuccess';

const AuthRoutes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signup-success" component={SignUpSuccess} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route
          path="/forgot-password-success"
          component={ForgotPasswordSuccess}
        />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route
          path="/reset-password-success"
          component={ResetPasswordSuccess}
        />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default AuthRoutes;
