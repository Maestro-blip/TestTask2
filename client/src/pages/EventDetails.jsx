import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (e) {
        console.error("Помилка декодування токена", e);
      }
    }

    api.get(`/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error("Помилка:", err));
  }, [id]);

  // --- 1. ДОДАНО ФУНКЦІЮ РЕЄСТРАЦІЇ ---
  const handleRegister = async () => {
    // Перевірка, чи юзер залогінений
    if (!currentUser) {
        alert("Будь ласка, увійдіть у систему, щоб зареєструватися.");
        return;
    }

    try {
        // Відправляємо запит на реєстрацію
        await api.post('/registrations', { eventId: id });
        
        alert("Ви успішно зареєструвалися!");
        navigate('/profile'); // Перенаправляємо в профіль

    } catch (err) {
        console.error(err);
        // Якщо сервер повернув повідомлення (наприклад, "Вже зареєстровані")
        if (err.response && err.response.data.message) {
            alert(err.response.data.message);
        } else {
            alert("Помилка реєстрації.");
        }
    }
  };
  // ------------------------------------

  const handleDelete = async () => {
    if (window.confirm("Ви точно хочете видалити цю подію?")) {
      try {
        await api.delete(`/events/${id}`);
        alert("Подію видалено!");
        navigate('/');
      } catch (err) {
        console.error(err);
        alert("Помилка видалення. Можливо, у вас немає прав.");
      }
    }
  };

  if (!event) return <p>Завантаження...</p>;

  const formattedDate = new Date(event.date).toLocaleString('uk-UA', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Використовуємо == (нестроге дорівнює), щоб число 5 дорівнювало рядку "5"
  const isOwner = currentUser && (currentUser.userID == event.created_by);
  const isAdmin = currentUser && (currentUser.role === 'Admin');

  const canDelete = isAdmin || isOwner; 

  return (
    <div className="event-details-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <h1 style={{ marginBottom: '20px' }}>{event.title}</h1>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <p>📅 <strong>Дата:</strong> {formattedDate}</p>
        <p>📍 <strong>Місце:</strong> {event.location}</p>
        <p>👥 <strong>Місць:</strong> {event.capacity}</p>
        <hr style={{ margin: '20px 0', opacity: 0.3 }} />
        <h3>Опис:</h3>
        <p>{event.description}</p>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
          
          {/* 2. ДОДАНО onClick={handleRegister} */}
          <button 
            onClick={handleRegister}
            style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px' }}
          >
             Зареєструватися
          </button>

          {canDelete && (
            <button 
              onClick={handleDelete} 
              style={{ 
                  backgroundColor: '#dc3545', color: 'white', padding: '10px 20px', 
                  border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '5px'
              }}
            >
              🗑 Видалити
            </button>
          )}
      </div>
    </div>
  );
};

export default EventDetails;