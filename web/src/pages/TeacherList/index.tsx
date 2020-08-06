import React, { useState, useCallback } from 'react';
import { Form } from '@unform/web';
import { toast } from 'react-toastify';

import Input from '../../components/Input';
import PageHeader from '../../components/PageHeader';
import Select from '../../components/Select';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import api from '../../services/api';

import './styles.css';

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const handleSubmit = useCallback(data => {
    (async () => {
      try {
        const response = await api.get<Teacher[]>('classes', {
          params: data,
        });
        setTeachers(response.data);
      } catch (err) {
        toast.error('Ops! Alguma coisa deu errado, tente mais tarde!');
      }
    })();
  }, []);

  return (
    <div id="page-teacher-list" className="container">
      <PageHeader title="Estes são os proffys disponíveis.">
        <Form id="search-teachers" onSubmit={handleSubmit}>
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
          <Select
            name="week_day"
            label="Dia da semana"
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
          <Input type="time" name="time" label="Horário"></Input>

          <button type="submit">Buscar</button>
        </Form>
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
