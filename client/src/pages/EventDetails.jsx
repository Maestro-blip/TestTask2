import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
        
        
        if (user && (user.role === 'admin' || user.id === data.createdBy)) {
          const pData = await api.get(`/events/${id}/participants`);
          setParticipants(pData.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id, user]);

  const handleRegister = async () => {
    try {
      await api.post(`/events/${id}/register`);
      alert('Ви успішно зареєстровані!');
      navigate('/me');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка реєстрації');
    }
  };

  if (!event) return <div>Завантаження...</div>;

  const isOwner = user?.id === event.createdBy;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Дата:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Місце:</strong> {event.location}</p>
      <p><strong>Місць:</strong> {event.capacity}</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user ? (
        !isOwner && user.role !== 'admin' ? (
          <button onClick={handleRegister}>Зареєструватись</button>
        ) : (
          <p>Ви організатор або адмін (реєстрація недоступна)</p>
        )
      ) : (
        <p>Увійдіть, щоб зареєструватись</p>
      )}

      {}
      {(isOwner || user?.role === 'admin') && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc' }}>
          <h3>Учасники:</h3>
          <ul>
            {participants.map(p => (
              <li key={p.id}>{p.userId} (Дата реєстрації: {new Date(p.createdAt).toLocaleDateString()})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventDetails;