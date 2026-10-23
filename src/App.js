import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';

// Importación de todas las páginas
import Dashboard from './pages/Dashboard';
import Lineas from './pages/Lineas';
import Estaciones from './pages/Estaciones';
import Buses from './pages/Buses';
import Pilotos from './pages/Pilotos';
import Municipalidades from './pages/Municipalidades';
import Parqueos from './pages/Parqueos';
import Accesos from './pages/Accesos';
import Distancias from './pages/Distancias';
import Operadores from './pages/Operadores';
import Alertas from './pages/Alertas';
import Reportes from './pages/Reportes';
import Tarjetas from './pages/Tarjetas';
import Pagos from './pages/Pagos';
import Monitoreo from './pages/Monitoreo';

function App() {
  // Verificamos si ya hay una sesión guardada en el navegador
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = () => setIsLoggedIn(true);
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lineas" element={<Lineas />} />
        <Route path="/estaciones" element={<Estaciones />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/pilotos" element={<Pilotos />} />
        <Route path="/municipalidades" element={<Municipalidades />} />
        <Route path="/parqueos" element={<Parqueos />} />
        <Route path="/accesos" element={<Accesos />} />
        <Route path="/distancias" element={<Distancias />} />
        <Route path="/operadores" element={<Operadores />} />
        <Route path="/tarjetas" element={<Tarjetas />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/monitoreo" element={<Monitoreo />} />
      </Routes>
    </Router>
  );
}

export default App;