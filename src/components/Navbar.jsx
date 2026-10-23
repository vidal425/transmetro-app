import { NavLink } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  // Función que aplica estilos dependiendo de si la ruta está activa o no
  const navLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: isActive ? 'bold' : 'normal',
    backgroundColor: isActive ? '#3498db' : 'transparent', // Azul brillante si está activo
    color: isActive ? 'white' : '#bdc3c7',                 // Blanco si está activo, gris si no
    transition: 'all 0.2s ease',
    display: 'inline-block',
    margin: '2px'
  });

  return (
    <nav style={{
      background: '#2c3e50',
      padding: '12px 20px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '5px',
      alignItems: 'center',
      borderBottom: '4px solid #1a252f',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <h2 style={{ color: 'white', margin: 0, marginRight: '15px', fontSize: '20px' }}>🚌 Transmetro</h2>
      
      {/* Usamos NavLink en lugar de Link */}
      <NavLink to="/" style={navLinkStyle}>Panel</NavLink>
      <NavLink to="/municipalidades" style={navLinkStyle}>1️⃣ Municipalidades</NavLink>
      <NavLink to="/lineas" style={navLinkStyle}>2️⃣ Líneas</NavLink>
      <NavLink to="/estaciones" style={navLinkStyle}>3️⃣ Estaciones</NavLink>
      <NavLink to="/parqueos" style={navLinkStyle}>4️⃣ Parqueos</NavLink>
      <NavLink to="/accesos" style={navLinkStyle}>4️⃣ Accesos</NavLink>
      <NavLink to="/operadores" style={navLinkStyle}>4️⃣ Operadores</NavLink>
      <NavLink to="/distancias" style={navLinkStyle}>5️⃣ Distancias</NavLink>
      <NavLink to="/pilotos" style={navLinkStyle}>👤 Pilotos</NavLink>
      <NavLink to="/buses" style={navLinkStyle}>6️⃣ Buses</NavLink>
      <NavLink to="/tarjetas" style={navLinkStyle}>💳 Tarjetas</NavLink>
      <NavLink to="/pagos" style={navLinkStyle}>💵 Pagos</NavLink>
      <NavLink to="/alertas" style={navLinkStyle}>🔔 Alertas</NavLink>
      <NavLink to="/reportes" style={navLinkStyle}>📊 Reportes</NavLink>
      <NavLink to="/monitoreo" style={navLinkStyle}>📍 Monitoreo GPS</NavLink>

      {/* Zona derecha: Usuario y Salir */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: '#ecf0f1', fontSize: '13px', fontWeight: 'bold' }}>
          👤 Admin
        </span>
        <button
          onClick={onLogout}
          style={{
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#c0392b'}
          onMouseOut={(e) => e.target.style.background = '#e74c3c'}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}