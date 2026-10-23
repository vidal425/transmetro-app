import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const ref = collection(db, 'operadores');

export const crearOperador = (data) => addDoc(ref, data);
export const obtenerOperadores = async () => {
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const eliminarOperador = (id) => deleteDoc(doc(db, 'operadores', id));
export const escucharOperadores = (cb) => onSnapshot(ref, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));