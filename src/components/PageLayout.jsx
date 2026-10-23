// src/components/PageLayout.jsx
import { Link } from 'react-router-dom';

export default function PageLayout({ title, children }) {
  return (
    <div style={{ padding: '20px' }}>
      {/* BOTÓN VOLVER */}
      <Link to="/" style={{
        textDecoration: 'none',
        color: 'white',
        backgroundColor: '#34495e',
        padding: '8px 16px',
        borderRadius: '5px',
        display: 'inline-block',
        marginBottom: '20px',
        fontWeight: 'bold'
      }}>
        ⬅️ Volver al Panel Principal
      </Link>

      {/* RECUADRO DEL CONTENIDO */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        borderTop: '5px solid #3498db'
      }}>
        <h2 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}