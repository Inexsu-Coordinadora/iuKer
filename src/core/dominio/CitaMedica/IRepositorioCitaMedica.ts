import { citaMedicaDTO } from '../../infraestructura/esquemas/citaMedicaEsquema.js';
import { ICitaMedica } from './ICitaMedica.js';

export interface IRepositorioCitaMedica {
  obtenerCitas(limite?: number): Promise<ICitaMedica[]>;
  obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
  agendarCita(datosCitaMedica: ICitaMedica): Promise<ICitaMedica>;
  eliminarCita(idCita: string): Promise<void>;

  disponibilidadMedico(datosCitaMedica: citaMedicaDTO): Promise<boolean>;
  validarCitasPaciente(datosCitaMedica: citaMedicaDTO): Promise<boolean>;
  validarTurnoMedico(datosCitaMedica: citaMedicaDTO): Promise<boolean>;
 // Métodos para validaciones de traslape
  verificarTraslapeMedico(
    medico: string,
    fecha: string,
    horaInicio: string,
    idCitaExcluir?: string
  ): Promise<{ hayTraslape: boolean; citaConflicto?: ICitaMedica }>;

  verificarTraslapePaciente(
    tipoDocPaciente: number,
    numeroDocPaciente: string,
    fecha: string,
    horaInicio: string,
    idCitaExcluir?: string
  ): Promise<{ hayTraslape: boolean; citaConflicto?: ICitaMedica }>;

  // Métodos para reprogramación y cancelación
  reprogramarCita(idCitaAnterior: string, nuevasCitas: ICitaMedica): Promise<ICitaMedica>;
  cancelarCita(idCita: string): Promise<ICitaMedica>;
  finalizarCita(idCita: string): Promise<ICitaMedica>;
}
