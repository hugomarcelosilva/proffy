import { Link } from 'react-router-dom';
import React from 'react';
import successCheckIcon from '../../../assets/images/icons/success-check-icon.svg';

import './styles.css';

const ResetPasswordSuccess = () => {
  return (
    <div id="page-forgot-password-success">
      <div className="content">
        <div>
          <img src={successCheckIcon} alt="Success check" />
        </div>
        <h1>Reset de senha concluído!</h1>
        <p>Sua nova senha já pode ser usada!</p>

        <Link to="/">Voltar ao login</Link>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;
