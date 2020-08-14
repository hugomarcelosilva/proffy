import React, { useRef, useCallback, useState } from 'react';
import { Form } from '@unform/web';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { object, string, array, ValidationError } from 'yup';
import { FormHandles } from '@unform/core';
import { User } from '@styled-icons/fa-solid';
import { Camera } from '@styled-icons/feather';

import formatTime from '../../utils/formatTime';

import Input from '../../components/Input';
import PageHeader from '../../components/PageHeader';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';

import warningIcon from '../../assets/images/icons/warning.svg';

import { useAuth } from '../../contexts/auth';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import './styles.css';

interface ProfileFormData {
  name: string;
  surname: string;
  email: string;
  whatsapp: string;
  bio: string;
  subject: string;
  cost: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const [schedules, setSchedules] = useState(user.schedules);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = object().shape({
          name: string().required('Nome é obrigatório'),
          surname: string().required('Sobrenome é obrigatório'),
          whatsapp: string().required('Número é obrigatório'),
          bio: string().required('Biografia é obrigatória'),
          subject: string().required('Matéria é obrigatória'),
          cost: string().required('Custo da hora é obrigatório'),
          schedule: array().of(
            object().shape({
              week_day: string().required('Dia da semana é obrigatório'),
              from: string().required('Hora inicial é obrigatória'),
              to: string().required('Hora final é obrigatória'),
            }),
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const response = await api.put(`profiles/${user.id}`, {
          name: `${data.name} ${data.surname}`,
          whatsapp: data.whatsapp,
          bio: data.bio,
          subject: data.subject,
          cost: data.cost,
          schedule: schedules,
        });

        await updateUser(response.data);

        history.push('/');

        toast.success(
          'Suas informações do perfil foram atualizadas com sucesso!',
        );
      } catch (err) {
        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        } else {
          toast.error('Ops! Alguma coisa deu errado, tente novamente!');
        }
      }
    },
    [schedules, history, updateUser, user.id],
  );

  const setScheduleItemValue = useCallback(
    (scheduleIndex: number, field: string, value: string) => {
      setSchedules(state => {
        return state.map((item, index) =>
          index === scheduleIndex ? { ...item, [field]: value } : item,
        );
      });
    },
    [],
  );

  const handleDeleteSchedule = (index: number, class_id: number) => {
    const newArray = schedules.filter((scheduleItem, scheduleIndex) => {
      return index !== scheduleIndex;
    });

    setSchedules(newArray);
  };

  const handleImageUpdate = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await api.put(
          `/profiles/avatar/${user?.id}`,
          formData,
        );

        await updateUser(response.data);

        toast.success('Avatar atualizado');
      } catch (e) {
        alert('erro ao atualizar sua imagem, tente novamente mais tarde!');
      }
    },
    [user, updateUser],
  );

  return (
    <div id="page-profile" className="container">
      <PageHeader title="" description="">
        <div className="profile-main-info">
          <div className="profile-image">
            {user && user.avatar ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${user.avatar}`}
                alt="user"
                className="profile-image-picture"
              />
            ) : (
              <User className="profile-image-picture" />
            )}
            <label htmlFor="file" className="change-image">
              <Camera size={24} color="white" />
            </label>
            <input
              onChange={e => {
                if (e.target.files) {
                  handleImageUpdate(e.target.files[0]);
                }
              }}
              id="file"
              type="file"
              hidden
            />
          </div>
          <h3>{user.name}</h3>
          {user.subject && <h2>{user.subject}</h2>}
        </div>
      </PageHeader>

      <main>
        <Form
          ref={formRef}
          initialData={{
            name: user.name.slice(0, user.name.indexOf(' ')),
            surname: user.name.slice(
              user.name.indexOf(' ') + 1,
              user.name.length,
            ),
            email: user.email,
            whatsapp: user.whatsapp,
            bio: user.bio,
            subject: user.subject,
            cost: user.cost,
          }}
          onSubmit={handleSubmit}
        >
          <fieldset>
            <legend>Seus dados</legend>
            <div className="name-item">
              <Input name="name" label="Nome" />
              <Input name="surname" label="Sobrenome" />
            </div>

            <div className="mail-number-item">
              <Input type="email" name="email" label="E-mail" />
              <Input name="whatsapp" label="Whatsapp" />
            </div>

            <Textarea
              name="bio"
              label="Biografia (Máximo 300 caracteres)"
              maxLength={300}
            />
          </fieldset>

          <fieldset>
            <legend>Sobre a aula</legend>

            <div className="about-item">
              <Select
                name="subject"
                label="Matéria"
                options={[
                  { value: 'Artes', label: 'Artes' },
                  { value: 'Biologia', label: 'Biologia' },
                  { value: 'Ciências', label: 'Ciências' },
                  { value: 'Educação Física', label: 'Educação Física' },
                  { value: 'Física', label: 'Física' },
                  { value: 'Geografia', label: 'Geografia' },
                  { value: 'História', label: 'História' },
                  { value: 'Matemática', label: 'Matemática' },
                  { value: 'Português', label: 'Português' },
                  { value: 'Química', label: 'Química' },
                ]}
              ></Select>
              <Input
                name="cost"
                label="Custo da sua hora por aula"
                placeholder="R$"
              ></Input>
            </div>
          </fieldset>

          <fieldset>
            <legend>Horários disponíveis</legend>

            {schedules?.map((schedule, index) => {
              return (
                <div key={index}>
                  <div className="schedule-item">
                    <Select
                      name={`schedule[${index}].week_day`}
                      label="Dia da semana"
                      defaultValue={schedule.week_day}
                      onChange={e =>
                        setScheduleItemValue(index, 'week_day', e.target.value)
                      }
                      options={[
                        { value: '0', label: 'Domingo' },
                        { value: '1', label: 'Segunda-feira' },
                        { value: '2', label: 'Terça-feira' },
                        { value: '3', label: 'Quarta-feira' },
                        { value: '4', label: 'Quinta-feira' },
                        { value: '5', label: 'Sexta-feira' },
                        { value: '6', label: 'Sábado' },
                      ]}
                      disabled
                    ></Select>
                    <Input
                      type="time"
                      name={`schedule[${index}].from`}
                      label="Das"
                      value={formatTime(schedule.from)}
                      onChange={e =>
                        setScheduleItemValue(index, 'from', e.target.value)
                      }
                      readOnly
                    ></Input>
                    <Input
                      type="time"
                      name={`schedule[${index}].to`}
                      label="Até"
                      value={formatTime(schedule.to)}
                      onChange={e =>
                        setScheduleItemValue(index, 'to', e.target.value)
                      }
                      readOnly
                    ></Input>
                  </div>
                  <div className="delete-schedule">
                    <hr></hr>
                    <h4
                      onClick={() =>
                        handleDeleteSchedule(index, schedule.class_id)
                      }
                      className="delete-schedule"
                    >
                      Excluir horário
                    </h4>
                  </div>
                </div>
              );
            })}
          </fieldset>

          <footer>
            <p>
              <img src={warningIcon} alt="Aviso importante" />
              Importante! <br />
              Preencha todos os dados
            </p>
            <button type="submit">Salvar cadastro</button>
          </footer>
        </Form>
      </main>
    </div>
  );
};

export default Profile;
