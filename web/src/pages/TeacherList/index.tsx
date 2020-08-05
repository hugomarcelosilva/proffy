import React, { useState, FormEvent } from 'react';

import Input from '../../components/Input';
import PageHeader from '../../components/PageHeader';
import Select from '../../components/Select';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import api from '../../services/api';

import './styles.css';

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState([]);

  const [subject, setSubject] = useState('');
  const [weekDay, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  async function searchTeachers(e: FormEvent) {
    e.preventDefault();

    const response = await api.get('classes', {
      params: {
        subject,
        week_day: weekDay,
        time,
      },
    });

    setTeachers(response.data);
  }

  return (
    <div id="page-teacher-list" className="container">
      <PageHeader title="Estes são os proffys disponíveis.">
        <form id="search-teachers" onSubmit={searchTeachers}>
          <Select
            name="subject"
            label="Matéria"
            value={subject}
            onChange={e => {
              setSubject(e.target.value);
            }}
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
          <Select
            name="week_day"
            label="Dia da semana"
            value={weekDay}
            onChange={e => {
              setWeekDay(e.target.value);
            }}
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
            name="time"
            label="Horário"
            value={time}
            onChange={e => {
              setTime(e.target.value);
            }}
          ></Input>

          <button type="submit">Buscar</button>
        </form>
      </PageHeader>

      <main>
        {teachers.length > 0 ? (
          teachers.map((teacher: Teacher) => {
            return (
              <TeacherItem key={teacher.id} teacher={teacher}></TeacherItem>
            );
          })
        ) : (
          <section>
            <p>
              Nenhum professor encontrado <br /> com sua pesquisa.
            </p>
          </section>
        )}
      </main>
    </div>
  );
};

export default TeacherList;
