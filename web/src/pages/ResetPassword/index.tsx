import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useRef, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { object, string, ref, ValidationError } from 'yup';
import { toast } from 'react-toastify';
import { Eye, EyeSlash } from '@styled-icons/bootstrap';

import DynamicInput from '../../components/DynamicInput';
import backIcon from '../../assets/images/icons/back.svg';
import logoImg from '../../assets/images/logo.svg';

import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import './styles.css';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();
  const { token } = useParams();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = object().shape({
          password: string().required('Senha obrigatória'),
          password_confirmation: string().oneOf(
            [ref('password'), ''],
            'Confirmação incorreta',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/reset-password', { token, password: data.password });

        history.push('/reset-password-success');
      } catch (err) {
        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        } else {
          toast.error('Ocorreu um erro ao resetar sua senha, tente novamente');
        }
      }
    },
    [history, token],
  );

  return (
    <div id="page-reset-password-form">
      <div className="form-wrapper">
        <Link to="/" className="back-button">
          <img src={backIcon} alt="Go back" />
        </Link>

        <Form className="form-content" onSubmit={handleSubmit}>
          <div className="form-main">
            <h2>Resetar senha</h2>
          </div>

          <DynamicInput
            type="password"
            name="password"
            label="Nova Senha"
            passwordIcons={[Eye as any, EyeSlash as any]}
          />
          <DynamicInput
            type="password"
            name="password_confirmation"
            label="Confirmação da senha"
            passwordIcons={[Eye as any, EyeSlash as any]}
          />

          <button type="submit" className="form-button">
            Enviar
          </button>
        </Form>
      </div>

      <div className="logo">
        <div>
          <img src={logoImg} alt="Proffy logo" />
          <p>Sua plataforma de estudos online.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
