import React, { useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { object, string, ValidationError } from 'yup';
import { toast } from 'react-toastify';
import { Eye, EyeSlash } from '@styled-icons/bootstrap';

import DynamicInput from '../../components/DynamicInput';

import logoImg from '../../assets/images/logo.svg';
import backIcon from '../../assets/images/icons/back.svg';

import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import './styles.css';

interface SignUpFormData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = object().shape({
          name: string().required('Nome obrigatório'),
          surname: string().required('Sobrenome obrigatório'),
          email: string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', {
          name: `${data.name} ${data.surname}`,
          email: data.email,
          password: data.password,
        });

        history.push('/signup-success');
      } catch (err) {
        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        } else {
          toast.error('Ocorreu um erro ao fazer o cadastro, tente novamente');
        }
      }
    },
    [history],
  );

  return (
    <div id="page-signup-form">
      <div className="form-wrapper">
        <Link to="/" className="back-button">
          <img src={backIcon} alt="Go back" />
        </Link>

        <Form className="form-content" ref={formRef} onSubmit={handleSubmit}>
          <div className="form-main">
            <h2>Cadastro</h2>
            <p>Preencha os dados abaixo para começar.</p>
          </div>

          <div className="form-inputs-container">
            <div className="form-divided-input">
              <DynamicInput type="text" name="name" label="Nome" />
              <DynamicInput type="text" name="surname" label="Sobrenome" />
            </div>
            <DynamicInput type="email" name="email" label="E-mail" />
            <DynamicInput
              type="password"
              name="password"
              label="Senha"
              passwordIcons={[Eye as any, EyeSlash as any]}
            />
          </div>

          <button type="submit" className="form-button">
            Concluir cadastro
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

export default SignUp;
