import { ICitaMedica } from './ICitaMedica.js';

export interface ICitasMedicasRepositorio {
  obtenerCitas(limite?: number): Promise<ICitaMedica[]>;
  obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
  agendarCita(datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null>;
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
  reprogramarCita(idCitaAnterior: string, nuevasCitas: ICitaMedica): Promise<ICitaMedica | null>;
  cancelarCita(idCita: string): Promise<ICitaMedica>;
  finalizarCita(idCita: string): Promise<ICitaMedica>;

  obtenerCitasPorPaciente(numeroDoc: string, limite?: number): Promise<any[]>;
}
