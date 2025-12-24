import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date'); 

  const fetchEvents = async () => {
    try {
      const { data } = await api.get(`/events?page=${page}&search=${search}&sort=${sortBy}`);
 
      setEvents(data); 
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, search, sortBy]);

  return (
    <div>
      <h1>Список подій</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Пошук за назвою..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">За датою</option>
          <option value="title">За назвою</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {events.map(event => (
          <div key={event.event_id} style={{ border: '1px solid #ddd', padding: '10px' }}>
            <h3>{event.title}</h3>
            <p>{new Date(event.date).toLocaleDateString()} - {event.location}</p>
            <Link to={`/events/${event.event_id}`}>Деталі</Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Назад</button>
        <span style={{ margin: '0 10px' }}>Сторінка {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Вперед</button>
      </div>
    </div>
  );
};

export default EventsList;