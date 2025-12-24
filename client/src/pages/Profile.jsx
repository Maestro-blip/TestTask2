import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <--- 1. Додали імпорт для переходу
import api from '../api/axios';

const Profile = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    api.get('/registrations')
      .then((response) => {
          setRegistrations(response.data); 
      })
      .catch((err) => {
          console.error("Помилка завантаження:", err);
      });
  }, []);

  return (
    <div>
      <h2>Особистий кабінет</h2>

      {/* --- 2. Додали кнопку переходу на сторінку створення --- */}
      <div style={{ marginBottom: '20px' }}>
          <Link to="/create-event">
            <button style={{ padding: '10px', cursor: 'pointer' }}>
              ➕ Створити нову подію
            </button>
          </Link>
      </div>
      {/* ------------------------------------------------------- */}

      <h3>Мої реєстрації</h3>
      {registrations.length === 0 ? <p>Ви ще не зареєстровані на події.</p> : (
        <ul>
          {registrations.map(reg => (
            <li key={reg.id}>
              Подія ID: {reg.eventId} (Зареєстровано: {new Date(reg.createdAt).toLocaleDateString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;