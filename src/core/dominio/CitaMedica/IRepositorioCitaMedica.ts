import { ICitaMedica } from './ICitaMedica.js';

export interface IRepositorioCitaMedica {
  obtenerCitas(limite?: number): Promise<ICitaMedica[]>;
  obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
  agendarCita(datosCitaMedica: ICitaMedica): Promise<ICitaMedica>;
  cambiarEstado(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica>;
  //reprogramarCita(idCita: number, datosCitaMedica: ICitaMedica): Promise<ICitaMedica>;
  // finalizarCita(idCita: number): Promise<ICitaMedica | null>;
  // cancelarCita(idCita: number): Promise<ICitaMedica | null>;
}
