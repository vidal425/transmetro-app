import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const ref = collection(db, 'municipalidades');

export const crearMunicipalidad = (data) => addDoc(ref, data);
export const obtenerMunicipalidades = async () => {
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const eliminarMunicipalidad = (id) => deleteDoc(doc(db, 'municipalidades', id));
export const escucharMunicipalidades = (cb) => onSnapshot(ref, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));