import { Link, useHistory } from 'react-router-dom';
import React, { useRef, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { object, string, ValidationError } from 'yup';
import { toast } from 'react-toastify';

import DynamicInput from '../../components/DynamicInput';
import backIcon from '../../assets/images/icons/back.svg';
import logoImg from '../../assets/images/logo.svg';

import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import './styles.css';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = () => {
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = object().shape({
          email: string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/forgot-password', { email: data.email });

        history.push('/forgot-password-success');
      } catch (err) {
        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        } else {
          toast.error(
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente',
          );
        }
      }
    },
    [history],
  );

  return (
    <div id="page-forgot-password-form">
      <div className="form-wrapper">
        <Link to="/" className="back-button">
          <img src={backIcon} alt="Go back" />
        </Link>

        <Form className="form-content" onSubmit={handleSubmit}>
          <div className="form-main">
            <h2>Eita, esqueceu sua senha?</h2>
            <p>Não esquenta, vamos dar um jeito nisso.</p>
          </div>

          <DynamicInput type="email" name="email" label="E-mail" />

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

export default ForgotPassword;
