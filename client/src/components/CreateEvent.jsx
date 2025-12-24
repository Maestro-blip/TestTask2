import { useState } from 'react';
import api from '../api/axios'; 
import { useNavigate } from 'react-router-dom'; 

const CreateEvent = () => {
  // 1. Додаємо capacity в початковий стан
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '' // <--- Нове поле
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Axios автоматично відправить всі поля, включаючи capacity
      await api.post('/events', formData); 
      
      setMessage('Подію успішно створено!');
      
      setTimeout(() => {
        navigate('/'); 
      }, 2000);

    } catch (err) {
      console.error(err);
      setMessage('Помилка при створенні події. Перевірте дані.');
    }
  };

  return (
    <div className="create-event-container">
      <h2>Створити нову подію</h2>
      
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Назва події:</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <label>Опис:</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <label>Дата та час:</label>
          <input 
            type="datetime-local" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <label>Місце проведення:</label>
          <input 
            type="text" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* 2. Додаємо input для Capacity */}
        <div>
          <label>Кількість місць (Capacity):</label>
          <input 
            type="number" 
            name="capacity" 
            value={formData.capacity} 
            onChange={handleChange} 
            required 
            min="1" 
            placeholder="Наприклад: 50"
          />
        </div>

        <button type="submit">Створити подію</button>
      </form>
    </div>
  );
};

export default CreateEvent;