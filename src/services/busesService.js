import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const busesRef = collection(db, 'buses');

export const crearBus = async (data) => {
  await addDoc(busesRef, data);
};

export const obtenerBuses = async () => {
  const snapshot = await getDocs(busesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const actualizarBus = async (id, data) => {
  await updateDoc(doc(db, 'buses', id), data);
};

export const eliminarBus = async (id) => {
  await deleteDoc(doc(db, 'buses', id));
};

export const escucharBuses = (callback) => {
  return onSnapshot(busesRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};