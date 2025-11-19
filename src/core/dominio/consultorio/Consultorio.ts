import { IConsultorio } from './IConsultorio.js';

export class Consultorio implements IConsultorio{
  idConsultorio: string;
  ubicacion?: string | null | undefined;
  estado: IConsultorio['estado'];
  constructor(datosConsultorio: IConsultorio){
    this.idConsultorio = datosConsultorio.idConsultorio;
    this.ubicacion = datosConsultorio.ubicacion;
    this.estado = 7;
  }
}