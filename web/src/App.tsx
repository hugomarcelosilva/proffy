import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/auth';
import Routes from './routes';

import './assets/styles/global.css';

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </>
  );
}

export default App;
