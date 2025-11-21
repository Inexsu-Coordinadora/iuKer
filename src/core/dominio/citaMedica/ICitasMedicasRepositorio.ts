import { CitaMedicaResumenDTO } from '../../infraestructura/repositorios/postgres/dtos/citaMedicaResumenDTO.js';
import { ICitaMedica } from './ICitaMedica.js';

export interface ICitasMedicasRepositorio {
  obtenerCitas(limite?: number): Promise<CitaMedicaResumenDTO[]>;
  obtenerCitaPorId(idCita: string): Promise<CitaMedicaResumenDTO | null>;
  agendarCita(datosCitaMedica: ICitaMedica): Promise<CitaMedicaResumenDTO | null>;
  eliminarCita(idCita: string): Promise<void>;

  // Métodos para validaciones de traslape
  validarDisponibilidadMedico(
    medico: string,
    fecha: string,
    horaInicio: string,
    idCitaExcluir?: string
  ): Promise<boolean>;

  validarCitasPaciente(
    tipoDocPaciente: number,
    numeroDocPaciente: string,
    fecha: string,
    horaInicio: string,
    idCitaExcluir?: string
  ): Promise<boolean>;

  validarTurnoMedico(medico: string, fecha: string, horaInicio: string): Promise<boolean>;

  // Métodos para reprogramación y cancelación
  reprogramarCita(idCitaAnterior: string, nuevasCitas: ICitaMedica): Promise<CitaMedicaResumenDTO | null>;
  cancelarCita(idCita: string): Promise<CitaMedicaResumenDTO | null>;
  finalizarCita(idCita: string): Promise<CitaMedicaResumenDTO | null>;

  obtenerCitasPorPaciente(numeroDoc: string, limite?: number): Promise<any[]>;
}
