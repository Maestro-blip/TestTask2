import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '15px', padding: '15px', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Всі події</Link>
      {user ? (
        <>
          <Link to="/me">Мої реєстрації</Link>
          {user.role === 'admin' && <Link to="/admin">Адмін панель</Link>}
          <span>Привіт, {user.email || 'User'}</span>
          <button onClick={logout}>Вийти</button>
        </>
      ) : (
        <Link to="/login">Увійти</Link>
      )}
    </nav>
  );
};

export default Navbar;