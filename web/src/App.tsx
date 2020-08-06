import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Routes from './routes';

import './assets/styles/global.css';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes />
    </>
  );
}

export default App;
