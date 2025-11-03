import { da } from 'zod/v4/locales';
import { ICitaMedica } from './ICitaMedica.js';

export class CitaMedica implements ICitaMedica {
  //readonly idCita?: string | null;
  readonly medico: string;
  readonly tipoDocPaciente: number;
  readonly numeroDocPaciente: string;
  readonly idConsultorio: string;
  readonly fecha: Date;
  readonly horaInicio: string;
  readonly duracion: string;
  private estado: ICitaMedica['estadoCita'];
  readonly idCitaAnterior?: string | null;

  constructor(datosCitaMedica: Omit<ICitaMedica, 'estadoCita'>) {
    //poner validaciones de que si existan los campos aqui porque en produccion esto puede lanzar un error (revisar esto)
    //this.idCita = datosCitaMedica.idCita ?? null;
    this.medico = datosCitaMedica.medico;
    this.tipoDocPaciente = datosCitaMedica.tipoDocPaciente;
    this.numeroDocPaciente = datosCitaMedica.numeroDocPaciente;
    this.idConsultorio = datosCitaMedica.idConsultorio;
    this.fecha = datosCitaMedica.fecha;
    this.horaInicio = datosCitaMedica.horaInicio;
    this.duracion = datosCitaMedica.duracion;
    this.estado = 1;
    this.idCitaAnterior = datosCitaMedica.idCitaAnterior ?? null;
  }

  get estadoCita() {
    return this.estado;
  }

  actualizarEstado(nuevoEstado: ICitaMedica['estadoCita'], accionError: string) {
    if (this.estado !== 1) {
      throw new Error(`No se puede ${accionError} la cita si su estado actual no es "Agendada"`);
    }
    this.estado = nuevoEstado;
  }
}
