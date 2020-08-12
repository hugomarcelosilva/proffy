import { Link } from 'react-router-dom';
import React from 'react';
import successCheckIcon from '../../../assets/images/icons/success-check-icon.svg';

import './styles.css';

const ForgotPasswordSuccess = () => {
  return (
    <div id="page-forgot-password-success">
      <div className="content">
        <div>
          <img src={successCheckIcon} alt="Success check" />
        </div>
        <h1>Redefinição enviada!</h1>
        <p>
          Boa, agora é só checar o e-mail que foi enviado para você
          <br />
          redefinir sua senha e aproveitar os estudos.
        </p>

        <Link to="/">Voltar ao login</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordSuccess;
