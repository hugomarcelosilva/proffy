import React, { useContext, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { object, string, ValidationError } from 'yup';
import { toast } from 'react-toastify';

import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';

import AuthContext from '../../contexts/auth';
import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import './styles.css';
import Textarea from '../../components/Textarea';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  avatar: string;
  whatsapp: string;
  bio: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = object().shape({
          name: string().required('Nome obrigatório'),
          email: string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: string().required('Senha obrigatória'),
          avatar: string().required('Avatar obrigatório'),
          whatsapp: string().required('Número de whatspp obrigatório'),
          bio: string().required('Biografia obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        await signIn({ email: data.email, password: data.password });

        toast.success('Conta criada com sucesso!');

        history.push('/');
      } catch (err) {
        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        } else {
          toast.error('Ops! Alguma coisa deu errado, tente novamente!');
        }
      }
    },
    [signIn, history],
  );

  return (
    <div id="page-signup-form" className="container">
      <PageHeader
        title="Que maneiro que você quer se registrar."
        description="O primeiro passo é preencher o formulario de cadastro"
      />
      <main>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <fieldset>
            <legend>Crie sua conta</legend>
            <Input name="name" label="Nome completo" />
            <Input name="email" label="E-mail" />
            <Input name="avatar" label="Avatar" />
            <Input name="whatsapp" label="Whatsapp" />
            <Textarea name="bio" label="Biografia" />
            <Input type="password" name="password" label="Senha" />
          </fieldset>
          <footer>
            <button type="submit">Salvar cadastro</button>

            <button onClick={() => history.push('/signin')}>
              Já tenho cadastro
            </button>
          </footer>
        </Form>
      </main>
    </div>
  );
};

export default SignUp;
