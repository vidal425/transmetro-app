import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const ref = collection(db, 'parqueos');

export const crearParqueo = (data) => addDoc(ref, data);
export const obtenerParqueos = async () => {
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const actualizarParqueo = (id, data) => updateDoc(doc(db, 'parqueos', id), data);
export const eliminarParqueo = (id) => deleteDoc(doc(db, 'parqueos', id));
export const escucharParqueos = (cb) => onSnapshot(ref, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));