import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Зберігаємо інфо про поточного юзера

  useEffect(() => {
    // 1. Отримуємо дані про поточного користувача з токена
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // payload має містити { userID: ..., role: ..., email: ... }
        setCurrentUser(payload);
      } catch (e) {
        console.error("Помилка декодування токена", e);
      }
    }

    // 2. Отримуємо деталі події
    api.get(`/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error("Помилка:", err));
  }, [id]);

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

  // --- ЛОГІКА ПРАВ ДОСТУПУ ---
  // Перевіряємо: чи користувач Адмін АБО чи його ID збігається з ID творця події
  // УВАГА: Перевір, як у тебе в базі називається колонка автора: createdBy, user_id чи creator_id?
  // Я використовую `createdBy` як у твоєму описі, але якщо в SQL це `user_id`, зміни тут.
  const isOwner = currentUser && (currentUser.userID === event.created_by);
  const isAdmin = currentUser && (currentUser.role === 'Admin');

  const canDelete = isAdmin || isOwner; 
  // ---------------------------

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
          <button style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px' }}>
             Зареєструватися
          </button>

          {/* Показуємо кнопку, якщо є права */}
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