import { useState } from 'react';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (usuario === 'admin' && password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'admin');
      onLogin();
    } else {
      setError('Credenciales incorrectas. Usa admin / admin');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#2c3e50'
    }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', width: '350px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '5px' }}>🚌 Transmetro</h2>
        <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '14px', marginBottom: '20px' }}>Sistema de Control</p>

        {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '13px', background: '#fadbd8', padding: '8px', borderRadius: '4px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Usuario" 
            value={usuario} 
            onChange={(e) => setUsuario(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
