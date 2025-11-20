import { citaMedicaDTO } from '../../infraestructura/esquemas/citaMedicaEsquema.js';
import { ICitaMedica } from './ICitaMedica.js';

export interface ICitasMedicasRepositorio {
  obtenerCitas(limite?: number): Promise<ICitaMedica[]>;
  obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
  agendarCita(datosCitaMedica: ICitaMedica): Promise<ICitaMedica>;
  eliminarCita(idCita: string): Promise<void>;

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

  validarTurnoMedico(datosCitaMedica: citaMedicaDTO): Promise<boolean>;

  // Métodos para reprogramación y cancelación
  reprogramarCita(idCitaAnterior: string, nuevasCitas: ICitaMedica): Promise<ICitaMedica>;
  cancelarCita(idCita: string): Promise<ICitaMedica>;
  finalizarCita(idCita: string): Promise<ICitaMedica>;

  validarDisponibilidadMedico(datosCitaMedica: citaMedicaDTO): Promise<boolean>;
  validarCitasPaciente(datosCitaMedica: citaMedicaDTO): Promise<boolean>;
  obtenerCitasPorPaciente(numeroDoc: string, limite?: number): Promise<any[]>;
  eliminarCitasPorMedico(tarjetaProfesional : string) : Promise <void>;
}
