import { IAsignacionMedicoConsultorio } from './IAsignacionMedicoConsultorio.js';

export class AsignacionMedicoConsultorio
  implements IAsignacionMedicoConsultorio
{
  public tarjetaProfesionalMedico: string;
  public idConsultorio: string;
  public diaSemana: number;
  public inicioJornada: string;
  public finJornada: string;

  constructor(data: IAsignacionMedicoConsultorio) {
    this.tarjetaProfesionalMedico = data.tarjetaProfesionalMedico;
    this.idConsultorio = data.idConsultorio;
    this.diaSemana = data.diaSemana;
    this.inicioJornada = data.inicioJornada;
    this.finJornada = data.finJornada;
  }
}
