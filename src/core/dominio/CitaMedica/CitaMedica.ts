import { ICitaMedica } from './ICitaMedica.js';
import { EstadoPersonalizado } from '../../../common/EstadoPersonalizado.enum.js';
export class CitaMedica implements ICitaMedica {
  readonly medico: string;
  readonly tipoDocPaciente: number;
  readonly numeroDocPaciente: string;
  readonly fecha: string;
  readonly horaInicio: string;
  public estado: ICitaMedica['estado'];

  constructor(datosCitaMedica: Omit<ICitaMedica, 'estado'>) {
    this.medico = datosCitaMedica.medico;
    this.tipoDocPaciente = datosCitaMedica.tipoDocPaciente;
    this.numeroDocPaciente = datosCitaMedica.numeroDocPaciente;
    this.fecha = datosCitaMedica.fecha;
    this.horaInicio = datosCitaMedica.horaInicio;
    this.estado = 1;
  }
}
