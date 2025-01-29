import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br'; // Importa a localidade em português
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosInstance from '../axiosConfig';

moment.locale('pt-br'); // Define a localidade para português

const localizer = momentLocalizer(moment);

const dayMap = {
  'Domingo': 0,
  'Segunda': 1,
  'Terça': 2,
  'Quarta': 3,
  'Quinta': 4,
  'Sexta': 5,
  'Sábado': 6
};

const messages = {
  allDay: 'Todo o dia',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há eventos neste intervalo.',
  showMore: total => `+ Ver mais (${total})`
};

function Agenda() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        const response = await axiosInstance.get('matriculas/');
        const data = response.data;
        const formattedEvents = data.flatMap(matricula => {
          return matricula.dias_semana.map(dia => {
            const dayOfWeek = dayMap[dia]; // Convert day name to day number
            const start = moment().day(dayOfWeek).set({
              hour: moment(matricula.horario_aula, 'HH:mm').hour(),
              minute: moment(matricula.horario_aula, 'HH:mm').minute(),
              second: 0,
              millisecond: 0
            }).toDate();
            const end = moment(start).add(1, 'hour').toDate(); // Assuming each class is 1 hour long
            return {
              title: matricula.cliente_nome,
              start: start,
              end: end,
              allDay: false,
            };
          });
        });
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Erro ao carregar Matrículas:', error);
      }
    };

    fetchMatriculas();
  }, []);

  return (
    <div>
      <h4 className="text-center bg-black text-white py-2">Agenda</h4>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        style={{ height: 500 }}
      />
    </div>
  );
}

export default Agenda;