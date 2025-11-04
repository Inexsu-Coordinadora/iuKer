import { da } from 'zod/v4/locales';
import { ICitaMedica } from './ICitaMedica.js';

export class CitaMedica implements ICitaMedica {
  readonly idCita: string;
  readonly medico: string;
  readonly tipoDocPaciente: number;
  readonly numeroDocPaciente: string;
  readonly idConsultorio: string;
  readonly fecha: string;
  readonly horaInicio: string;
  readonly duracion: string;
  public estado: number;

  constructor(datosCitaMedica: ICitaMedica) {
    this.idCita = datosCitaMedica.idCita;
    this.medico = datosCitaMedica.medico;
    this.tipoDocPaciente = datosCitaMedica.tipoDocPaciente;
    this.numeroDocPaciente = datosCitaMedica.numeroDocPaciente;
    this.idConsultorio = datosCitaMedica.idConsultorio;
    this.fecha = datosCitaMedica.fecha;
    this.horaInicio = datosCitaMedica.horaInicio;
    this.duracion = datosCitaMedica.duracion;
    this.estado = 1;
  }
}
