import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const ref = collection(db, 'pagos');

export const crearPago = (data) => addDoc(ref, {
  ...data,
  fecha: new Date().toISOString(),
  estado: 'completado'
});

export const obtenerPagos = async () => {
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const eliminarPago = (id) => deleteDoc(doc(db, 'pagos', id));

export const escucharPagos = (cb) => onSnapshot(ref, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));