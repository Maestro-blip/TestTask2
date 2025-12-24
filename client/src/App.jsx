import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import EventsList from './pages/EventsList';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './components/CreateEvent';

// Компонент для захисту роутів
const PrivateRoute = ({ children, roleRequired }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<EventsList />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-event" element={<CreateEvent />} />
            
            {/* Приватні роути */}
            <Route path="/me" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            <Route path="/admin" element={
              <PrivateRoute roleRequired="admin">
                <AdminDashboard />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;