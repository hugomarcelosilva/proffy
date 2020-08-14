import { Link } from 'react-router-dom';
import React from 'react';
import successCheckIcon from '../../../assets/images/icons/success-check-icon.svg';

import './styles.css';

const TeacherFormSuccess = () => {
  return (
    <div id="page-teacher-form-success">
      <div className="content">
        <div>
          <img src={successCheckIcon} alt="Success check" />
        </div>
        <h1>Cadastro salvo</h1>
        <p>
          Tudo certo, seu cadastro está na nossa lista de professores.
          <br />
          Agora é só ficar de olho no seu Whatsapp.
        </p>

        <Link to="/study">Acessar lista</Link>
      </div>
    </div>
  );
};

export default TeacherFormSuccess;
