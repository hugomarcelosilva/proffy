import React, { useContext, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { object, string, ValidationError } from 'yup';

import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';

import AuthContext from '../../contexts/auth';
import getValidationErrors from '../../utils/getValidationErrors';

import './styles.css';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useContext(AuthContext);
  const history = useHistory();

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

        await signIn({ email: data.email, password: data.password });

        history.push('/');
      } catch (err) {
        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
      }
    },
    [signIn, history],
  );

  return (
    <div id="page-signin-form" className="container">
      <PageHeader title="Digite seus dados para entrar na plataforma." />
      <main>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <fieldset>
            <legend>Faça seu login</legend>
            <Input name="email" label="E-mail" />
            <Input type="password" name="password" label="Senha" />
          </fieldset>
          <footer>
            <button type="submit">Entrar</button>

            <button onClick={() => history.push('/signup')}>Criar conta</button>
          </footer>
        </Form>
      </main>
    </div>
  );
};

export default SignIn;
