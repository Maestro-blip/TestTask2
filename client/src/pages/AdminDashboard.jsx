import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const { data } = await api.get('/events');
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Видалити цю подію?')) {
      try {
        await api.delete(`/events/${id}`);
        setEvents(events.filter(e => e.id !== id));
      } catch (err) {
        alert('Помилка видалення');
      }
    }
  };

  return (
    <div>
      <h2>Панель адміністратора</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Назва</th>
            <th>Дата</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(event.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;