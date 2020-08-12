import React, { useState, useRef, useCallback } from 'react';
import { Form } from '@unform/web';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { object, string, array, ValidationError } from 'yup';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import PageHeader from '../../components/PageHeader';
import Select from '../../components/Select';

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

  const { user } = useAuth();

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
          subject: string().required('Este campo é obrigatório'),
          cost: string().required('Este campo é obrigatório'),
          schedule: array().of(
            object().shape({
              week_day: string().required('Este campo é obrigatório'),
              from: string().required('Este campo é obrigatório'),
              to: string().required('Este campo é obrigatório'),
            }),
          ),
        });

        const data = {
          subject,
          cost,
          user_id: user.id,
          schedule: schedules,
        };

        await schema.validate(data, { abortEarly: false });

        await api.post('classes', data);

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
    [schedules, history, user.id],
  );

  return (
    <div id="page-teacher-form" className="container">
      <PageHeader
        title="Que incrível que você quer dar aulas."
        description="O primeiro passo é preencher esse formulário de inscrição."
      />

      <main>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <fieldset>
            <legend>Sobre a aula</legend>

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
              label="Custo da sua hora por aula (em R$)"
            ></Input>
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
