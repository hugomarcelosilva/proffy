import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Landing from '../pages/Landing';
import Profile from '../pages/Profile';
import TeacherList from '../pages/TeacherList';
import TeacherForm from '../pages/TeacherForm';
import TeacherFormSuccess from '../pages/TeacherForm/TeacherFormSuccess';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/study" component={TeacherList} />
        <Route path="/give-classes" component={TeacherForm} />
        <Route path="/give-classes-success" component={TeacherFormSuccess} />
        <Route path="/profile" component={Profile} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRoutes;
