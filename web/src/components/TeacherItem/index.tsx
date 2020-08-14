import React, { useState, useEffect } from 'react';

import TeacherItemTime from '../TeacherItemTime';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

import formatValue from '../../utils/formatValue';
import api from '../../services/api';

import './styles.css';

export interface Schedule {
  id: number;
  week_day: number;
  from: number;
  to: number;
}

export interface Teacher {
  user_id: number;
  avatar: string;
  bio: string;
  cost: number;
  id: number;
  name: string;
  subject: string;
  whatsapp: string;
}

interface TeacherItemProps {
  teacher: Teacher;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher }) => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  useEffect(() => {
    async function loadSchedule(): Promise<void> {
      const schedule = await api.get<Schedule[]>(
        `classes/schedules/${teacher.user_id}`,
      );

      setSchedule(schedule.data);
    }

    loadSchedule();
  }, [teacher.user_id]);

  function createNewConnection() {
    api.post('connections', {
      user_id: teacher.id,
    });
  }

  return (
    <article className="teacher-item">
      <header>
        <img
          src={`${process.env.REACT_APP_API_URL}/uploads/${teacher.avatar}`}
          alt={teacher.name}
        />
        <div>
          <strong>{teacher.name}</strong>
          <span>{teacher.subject}</span>
        </div>
      </header>

      <p>{teacher.bio}</p>

      <div className="schedules">
        <TeacherItemTime schedule={schedule} />
      </div>

      <footer>
        <p>
          Preço/hora
          <strong>{formatValue(teacher.cost)}</strong>
        </p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={createNewConnection}
          href={`https://wa.me/+55${teacher.whatsapp}`}
        >
          <img src={whatsappIcon} alt="Whatsapp" />
          Entrar em contato
        </a>
      </footer>
    </article>
  );
};

export default TeacherItem;
