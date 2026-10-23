import { obtenerBuses } from './busesService';
import { obtenerEstaciones } from './estacionesService';

// Requerimiento 5: mínimo N buses, máximo 2N por línea
export const validarBusesPorLinea = async (lineaId, numEstaciones) => {
  const buses = await obtenerBuses();
  const busesLinea = buses.filter(b => b.linea_id === lineaId);
  const minimo = numEstaciones;
  const maximo = numEstaciones * 2;

  return {
    actual: busesLinea.length,
    minimo,
    maximo,
    valido: busesLinea.length >= minimo && busesLinea.length <= maximo,
    mensaje: busesLinea.length < minimo
      ? `Faltan buses: mínimo ${minimo}, actuales ${busesLinea.length}`
      : busesLinea.length > maximo
        ? `Demasiados buses: máximo ${maximo}, actuales ${busesLinea.length}`
        : 'Cantidad de buses correcta'
  };
};

// Requerimiento 14: Alerta si estación supera el 50% de capacidad
export const verificarCapacidadEstacion = async (estacion, crearAlerta) => {
  const porcentaje = (estacion.ocupacion_actual / estacion.capacidad_maxima) * 100;

  if (porcentaje >= 50) {
    await crearAlerta({
      tipo: 'capacidad_excedida',
      estacion_id: estacion.id,
      estacion_nombre: estacion.nombre,
      mensaje: `Estación "${estacion.nombre}" al ${porcentaje.toFixed(0)}% de capacidad. Enviar otro bus.`,
      porcentaje: porcentaje.toFixed(0)
    });
    return true;
  }
  return false;
};

// Requerimiento 15: Si bus no llena 25%, espera 5 min
export const verificarBajaOcupacionBus = (bus) => {
  const porcentaje = (bus.ocupacion_actual / bus.capacidad_maxima) * 100;

  if (porcentaje < 25) {
    return {
      debeEsperar: true,
      minutosEspera: 5,
      mensaje: `Bus ${bus.placa} al ${porcentaje.toFixed(0)}% de ocupación. Esperando 5 minutos más.`
    };
  }
  return { debeEsperar: false };
};

// Requerimiento 7: Un bus no puede quedar sin parqueo
export const validarParqueoBus = (bus, parqueoId) => {
  if (!parqueoId) {
    return { valido: false, mensaje: 'El bus debe tener un parqueo asignado' };
  }
  return { valido: true };
};

// Requerimiento 4: Un bus solo puede estar en una línea
export const validarBusUnicaLinea = async (bus, nuevaLineaId) => {
  if (bus.linea_id && bus.linea_id !== nuevaLineaId) {
    return {
      valido: false,
      mensaje: `El bus ya está asignado a otra línea`
    };
  }
  return { valido: true };
};