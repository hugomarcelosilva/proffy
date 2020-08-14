import React, { useState, useRef, useCallback } from 'react';
import { Form } from '@unform/web';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { object, string, array, ValidationError } from 'yup';
import { FormHandles } from '@unform/core';
import { User } from '@styled-icons/fa-solid';

import Input from '../../components/Input';
import PageHeader from '../../components/PageHeader';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';

import rocket from '../../assets/images/icons/rocket.svg';
import warningIcon from '../../assets/images/icons/warning.svg';

import { useAuth } from '../../contexts/auth';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import './styles.css';

interface Schedule {
  week_day: number;
  from: string;
  to: string;
}

const TeacherForm: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      week_day: 0,
      from: '',
      to: '',
    },
  ]);

  const { user, updateUser } = useAuth();

  function addNewScheduleItem() {
    setSchedules([
      ...schedules,
      {
        week_day: 0,
        from: '',
        to: '',
      },
    ]);
  }

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

  const handleSubmit = useCallback(
    async ({ subject, cost }) => {
      try {
        formRef.current?.setErrors({});

        const schema = object().shape({
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

        const data = {
          subject,
          cost,
          schedule: schedules,
        };

        await schema.validate(data, { abortEarly: false });

        const response = await api.post(`classes/${user.id}`, data);

        updateUser(response.data);

        history.push('/give-classes-success');
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

  return (
    <div id="page-teacher-form" className="container">
      <PageHeader
        title="Que incrível que você quer dar aulas."
        description="O primeiro passo é preencher esse formulário de inscrição."
      >
        <div className="message-header">
          <img src={rocket} alt="rocket" />
          <h4>
            Prepare-se! <br /> Vai ser o máximo
          </h4>
        </div>
      </PageHeader>

      <main>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <fieldset>
            <legend>Seus dados</legend>
            <div className="page-teacher-info">
              <div className="page-teacher-info-user">
                {user && user.avatar ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${user.avatar}`}
                    alt="user"
                    className="page-teacher-profile"
                  />
                ) : (
                  <User className="page-teacher-profile" />
                )}
                <h3>{user?.name}</h3>
              </div>
              <Input
                readOnly
                name="whatsapp"
                label="Whatsapp"
                value={user.whatsapp ? user.whatsapp : ''}
              />
            </div>
            <Textarea
              readOnly
              name="bio"
              label="Biografia (Máximo 300 caracteres)"
              value={user.bio ? user.bio : ''}
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
            <legend>
              Horários disponíveis
              <button type="button" onClick={addNewScheduleItem}>
                + Novo horário
              </button>
            </legend>

            {schedules.map((schedule, index) => {
              return (
                <div key={`schedule[${index}]`} className="schedule-item">
                  <Select
                    name={`schedule[${index}].week_day`}
                    label="Dia da semana"
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
                  ></Select>
                  <Input
                    type="time"
                    name={`schedule[${index}].from`}
                    label="Das"
                    onChange={e =>
                      setScheduleItemValue(index, 'from', e.target.value)
                    }
                  ></Input>
                  <Input
                    type="time"
                    name={`schedule[${index}].to`}
                    label="Até"
                    onChange={e =>
                      setScheduleItemValue(index, 'to', e.target.value)
                    }
                  ></Input>
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

export default TeacherForm;
