import { ICitaMedica } from './ICitaMedica.js';

export class CitaMedica implements ICitaMedica {
  readonly medico: string;
  readonly tipoDocPaciente: number;
  readonly numeroDocPaciente: string;
  // readonly idConsultorio: string;
  readonly fecha: Date;
  readonly horaInicio: string;
  // readonly duracion: string;
  public estado: ICitaMedica['estado'];

  constructor(datosCitaMedica: Omit<ICitaMedica, 'estado'>) {
    this.medico = datosCitaMedica.medico;
    this.tipoDocPaciente = datosCitaMedica.tipoDocPaciente;
    this.numeroDocPaciente = datosCitaMedica.numeroDocPaciente;
    // this.idConsultorio = datosCitaMedica.idConsultorio;
    this.fecha = datosCitaMedica.fecha;
    this.horaInicio = datosCitaMedica.horaInicio;
    // this.duracion = datosCitaMedica.duracion;
    this.estado = 1;
  }
}
