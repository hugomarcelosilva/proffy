import React, { useContext } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import Landing from './pages/Landing';
import TeacherList from './pages/TeacherList';
import TeacherForm from './pages/TeacherForm';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import AuthContext from './contexts/auth';

function CustomRoute({ isPrivate, ...rest }: any) {
  const { signed } = useContext(AuthContext);

  if (isPrivate && !signed) {
    return <Redirect to="/signin" />;
  }

  if (!isPrivate && signed) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} />;
}

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Landing} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <CustomRoute isPrivate path="/study" component={TeacherList} />
      <CustomRoute isPrivate path="/give-classes" component={TeacherForm} />
    </BrowserRouter>
  );
};

export default Routes;
