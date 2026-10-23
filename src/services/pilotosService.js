import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const pilotosRef = collection(db, 'pilotos');

export const crearPiloto = async (data) => {
  await addDoc(pilotosRef, data);
};

export const obtenerPilotos = async () => {
  const snapshot = await getDocs(pilotosRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const actualizarPiloto = async (id, data) => {
  await updateDoc(doc(db, 'pilotos', id), data);
};

export const eliminarPiloto = async (id) => {
  await deleteDoc(doc(db, 'pilotos', id));
};

export const escucharPilotos = (callback) => {
  return onSnapshot(pilotosRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};