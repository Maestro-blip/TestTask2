import { useEffect, useState } from 'react';
import api from '../api/axios';

const Profile = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    api.get('/registrations/me')
      .then(({ data }) => setRegistrations(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Мої реєстрації</h2>
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