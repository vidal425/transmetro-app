import { useState, useEffect } from 'react';
import { escucharPagos, crearPago, eliminarPago } from '../services/pagosService';
import { escucharTarjetas, actualizarTarjeta } from '../services/tarjetasService';

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);
  const [tarjetaId, setTarjetaId] = useState('');
  const [monto, setMonto] = useState('1.00');
  const [metodo, setMetodo] = useState('tarjeta');

  useEffect(() => {
    const u1 = escucharPagos(setPagos);
    const u2 = escucharTarjetas(setTarjetas);
    return () => { u1(); u2(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tarjetas.length === 0) {
      alert('⚠️ Primero debes crear al menos una Tarjeta Ciudadana.\n\nVe a la sección 💳 Tarjetas.');
      return;
    }

    if (!tarjetaId) {
      alert('⚠️ Debes seleccionar una tarjeta.');
      return;
    }

    const tarjeta = tarjetas.find(t => t.id === tarjetaId);
    const montoNum = Number(monto);

    if (tarjeta.saldo < montoNum) {
      alert('⚠️ Saldo insuficiente en la tarjeta.');
      return;
    }

    await actualizarTarjeta(tarjetaId, { saldo: tarjeta.saldo - montoNum });

    await crearPago({
      tarjeta_id: tarjetaId,
      tarjeta_numero: tarjeta.numero,
      monto: montoNum,
      metodo
    });

    setTarjetaId('');
    alert('¡Pago registrado exitosamente!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Registro de Pagos</h2>

      {tarjetas.length === 0 && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          ⚠️ <strong>Falta:</strong> Crear al menos una <a href="/tarjetas" style={{ color: '#856404', textDecoration: 'underline' }}>Tarjeta Ciudadana</a>.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <select value={tarjetaId} onChange={(e) => setTarjetaId(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="">Seleccionar tarjeta</option>
          {tarjetas.map(t => (
            <option key={t.id} value={t.id}>{t.numero} - {t.titular} (Q{t.saldo?.toFixed(2)})</option>
          ))}
        </select>
        <input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="Monto" style={{ padding: '8px', marginRight: '10px' }} />
        <select value={metodo} onChange={(e) => setMetodo(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="tarjeta">Tarjeta Ciudadana</option>
          <option value="efectivo">Efectivo</option>
          <option value="debito">Tarjeta de Débito</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px' }}>Registrar Pago</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#16a085', color: 'white' }}>
          <tr><th>Tarjeta</th><th>Monto</th><th>Método</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {pagos.map(p => (
            <tr key={p.id}>
              <td>{p.tarjeta_numero}</td>
              <td>Q{p.monto?.toFixed(2)}</td>
              <td>{p.metodo}</td>
              <td>{p.fecha ? new Date(p.fecha).toLocaleString() : '-'}</td>
              <td>{p.estado}</td>
              <td><button onClick={() => eliminarPago(p.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}