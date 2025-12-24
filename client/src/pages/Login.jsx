import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Перемикач Login/Register
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
        alert('Реєстрація успішна! Тепер увійдіть.');
        setIsLogin(true);
        return;
      }
      navigate('/');
    } catch (err) {
      alert('Помилка: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Вхід' : 'Реєстрація'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit">{isLogin ? 'Увійти' : 'Зареєструватись'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
        {isLogin ? 'Немає акаунту? Реєстрація' : 'Вже є акаунт? Вхід'}
      </button>
    </div>
  );
};

export default Login;