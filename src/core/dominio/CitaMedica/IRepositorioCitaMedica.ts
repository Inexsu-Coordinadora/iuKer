import { citaMedicaDTO } from '../../infraestructura/esquemas/citaMedicaEsquema.js';
import { ICitaMedica } from './ICitaMedica.js';

export interface IRepositorioCitaMedica {
  obtenerCitas(limite?: number): Promise<ICitaMedica[]>;
  obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
  agendarCita(datosCitaMedica: ICitaMedica): Promise<ICitaMedica>;
  cambiarEstado(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica>;
  eliminarCita(idCita: string): Promise<void>;

  disponibilidadMedico(datosCitaMedica: citaMedicaDTO): Promise<boolean>;
  validarCitasPaciente(datosCitaMedica: citaMedicaDTO): Promise<boolean>;
  validarTurnoMedico(datosCitaMedica: citaMedicaDTO): Promise<boolean>;
  // obtenerConsultorioDeTurno(datosCitaMedica: citaMedicaDTO): Promise<string | null>;
  // disponibilidadConsultorio(datosCitaMedica: citaMedicaDTO, idConsultorio: string): Promise<boolean>;
}
