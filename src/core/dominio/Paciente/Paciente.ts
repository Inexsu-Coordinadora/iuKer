import { IPaciente } from './IPaciente.js';

export class Paciente implements IPaciente {
  public idPaciente?: string;
  public nombre: string;
  public apellidos: string;
  public fecha_nacimiento: Date;
  public sexo: string;
  public email: string;
  public telefono: string;
  public direccion: string;

  constructor(data: IPaciente) {
    this.nombre = data.nombre;
    this.apellidos = data.apellidos;
    this.fecha_nacimiento = data.fecha_nacimiento;
    this.sexo = data.sexo;
    this.email = data.email;
    this.telefono = data.telefono;
    this.direccion = data.direccion;
  }

  //Implementar metodos para realizar las validaciónes
}
