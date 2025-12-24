import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // Твій налаштований axios

const Profile = () => {
  const [registrations, setRegistrations] = useState([]);
  const [participants, setParticipants] = useState({}); // Тут зберігаємо списки учасників по ID події
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // 1. Дістаємо ID поточного юзера з localStorage (або декодуємо токен)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }

    // 2. Завантажуємо реєстрації
    api.get('/registrations')
      .then((res) => {
        // Захист, якщо прийде не масив
        const data = Array.isArray(res.data) ? res.data : [];
        setRegistrations(data);
      })
      .catch((err) => console.error("Помилка завантаження:", err));
  }, []);

  // --- ЛОГІКА: Показати/Сховати учасників ---
  const handleToggleParticipants = async (eventId) => {
    // Якщо список вже відкритий — закриваємо його
    if (participants[eventId]) {
      const newState = { ...participants };
      delete newState[eventId];
      setParticipants(newState);
      return;
    }

    // Якщо закритий — завантажуємо з сервера
    try {
      const res = await api.get(`/event/${eventId}/participants`);
      setParticipants(prev => ({ ...prev, [eventId]: res.data }));
    } catch (err) {
      alert("Не вдалося отримати учасників (або доступ заборонено)");
    }
  };

  // --- ЛОГІКА: Видалити подію ---
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Ви впевнені? Подія та всі реєстрації будуть видалені!")) return;

    try {
      await api.delete(`/event/${eventId}`);
      
      // Видаляємо подію локально, щоб не перезавантажувати сторінку
      setRegistrations(prev => prev.filter(item => item.event_id !== eventId));
      alert("Подію успішно видалено!");
    } catch (err) {
      console.error(err);
      alert("Помилка при видаленні (можливо, ви не власник)");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Особистий кабінет</h2>

      <div style={{ marginBottom: '20px' }}>
        <Link to="/create-event">
          <button style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px' }}>
            ➕ Створити нову подію
          </button>
        </Link>
      </div>

      <h3>Мої реєстрації</h3>
      {registrations.length === 0 ? <p>Список порожній.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {registrations.map(reg => {
            // Перевірка: чи я творець? (поля мають збігатися з тими, що шле бекенд)
            const isCreator = currentUserId && (reg.event_creator_id == currentUserId);

            return (
              <li key={reg.registration_id} style={{ 
                border: '1px solid #ddd', 
                marginBottom: '15px', 
                padding: '15px', 
                borderRadius: '8px',
                backgroundColor: isCreator ? '#f9fff9' : '#fff' // Трохи підсвічуємо свої події
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{reg.title || `Подія ID: ${reg.event_id}`}</strong>
                    <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                      📅 Зареєстровано: {new Date(reg.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* КНОПКИ (Тільки для власника) */}
                  {isCreator && (
                    <div>
                      <button 
                        onClick={() => handleToggleParticipants(reg.event_id)}
                        style={{ marginRight: '10px', cursor: 'pointer', padding: '5px 10px' }}
                      >
                        {participants[reg.event_id] ? '🔼 Сховати' : '👥 Учасники'}
                      </button>

                      <button 
                        onClick={() => handleDeleteEvent(reg.event_id)}
                        style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                      >
                        🗑 Видалити
                      </button>
                    </div>
                  )}
                </div>

                {/* СПИСОК УЧАСНИКІВ (Випадаючий блок) */}
                {isCreator && participants[reg.event_id] && (
                  <div style={{ marginTop: '15px', padding: '10px', background: '#f1f1f1', borderRadius: '5px' }}>
                    <strong>Список учасників:</strong>
                    {participants[reg.event_id].length > 0 ? (
                      <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                        {participants[reg.event_id].map((user, index) => (
                          <li key={index}>
                            👤 {user.email || user.username || `User ID: ${user.user_id}`}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontStyle: 'italic', margin: '5px 0 0 0' }}>Поки ніхто не зареєструвався.</p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Profile;