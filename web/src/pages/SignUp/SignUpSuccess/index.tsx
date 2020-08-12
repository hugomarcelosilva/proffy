import { Link } from 'react-router-dom';
import React from 'react';
import successCheckIcon from '../../../assets/images/icons/success-check-icon.svg';

import './styles.css';

const SignUpSuccess = () => {
  return (
    <div id="page-signup-success">
      <div className="content">
        <div>
          <img src={successCheckIcon} alt="Success check" />
        </div>
        <h1>Cadastro concluído</h1>
        <p>
          Agora você faz parte da plataforma da Proffy.
          <br />
          Tenha uma ótima experiência.
        </p>

        <Link to="/">Fazer login</Link>
      </div>
    </div>
  );
};

export default SignUpSuccess;
