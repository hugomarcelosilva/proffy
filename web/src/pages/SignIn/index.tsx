import React, { useRef, useCallback, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { object, string, ValidationError } from 'yup';
import { toast } from 'react-toastify';
import { Eye, EyeSlash } from '@styled-icons/bootstrap';

import DynamicInput from '../../components/DynamicInput';

import logoImg from '../../assets/images/logo.svg';
import purpleHeart from '../../assets/images/icons/purple-heart.svg';

import { useAuth } from '../../contexts/auth';
import getValidationErrors from '../../utils/getValidationErrors';

import './styles.css';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const history = useHistory();

  const [rememberPassword, setRememberPassword] = useState(false);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = object().shape({
          email: string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
          rememberPassword,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        } else {
          toast.error('Ocorreu um erro ao fazer login, cheque as credenciais');
        }
      }
    },
    [signIn, history, rememberPassword],
  );

  return (
    <div id="page-signin-form">
      <div className="logo">
        <div>
          <img src={logoImg} alt="Proffy logo" />
          <p>Sua plataforma de estudos online.</p>
        </div>
      </div>

      <Form className="form-wrapper" ref={formRef} onSubmit={handleSubmit}>
        <div className="form-content">
          <div className="form-main">
            <h2>Fazer login</h2>
            <Link to="/signup">Criar uma conta</Link>
          </div>

          <div className="form-inputs-container">
            <DynamicInput type="email" name="email" label="E-mail" />
            <DynamicInput
              type="password"
              name="password"
              label="Senha"
              passwordIcons={[Eye as any, EyeSlash as any]}
            />
          </div>

          <section className="form-password">
            <div>
              <label>
                Lembrar-me
                <input
                  type="checkbox"
                  checked={rememberPassword}
                  onChange={() => setRememberPassword(!rememberPassword)}
                />
                <span></span>
              </label>
            </div>
            <Link to="/forgot-password">Esqueci minha senha</Link>
          </section>

          <button type="submit" className="form-button">
            Entrar
          </button>
        </div>

        <footer className="form-desktop-footer">
          <p>
            Não tem conta ? <Link to="/signup">Cadastre-se</Link>
          </p>
          <p>
            É de graça <img src={purpleHeart} alt="Purple heart" />
          </p>
        </footer>
      </Form>
    </div>
  );
};

export default SignIn;
