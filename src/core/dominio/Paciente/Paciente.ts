import { IPaciente } from './IPaciente.js';

export class Paciente implements IPaciente {
  public numeroDoc: string;
  public tipoDoc: number;
  public nombre: string;
  public apellido: string;
  public fechaNacimiento: Date;
  public sexo: string;
  public email: string;
  public telefono: string;
  public direccion: string;

  constructor(data: IPaciente) {
    this.numeroDoc = data.numeroDoc;
    this.tipoDoc = data.tipoDoc;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.fechaNacimiento = data.fechaNacimiento;
    this.sexo = data.sexo;
    this.email = data.email;
    this.telefono = data.telefono;
    this.direccion = data.direccion;

    this.validarDatos();
  }

  private validarDatos(): void {
    // Validación 2: Comprobación de Mayoría de Edad (Regla de Negocio)
    if (!this.esMayorDeEdad(this.fechaNacimiento)) {
      console.log('Dominio: El paciente debe tener acompañante para la cita');
    }
  }

  private esMayorDeEdad(fechaNacimiento: Date): boolean {
    const fechaActual = new Date();
    const fechaNac = new Date(fechaNacimiento);

    // Calcular la fecha hace 18 años
    const mayoriaEdad = new Date(
      fechaNac.getFullYear() + 18,
      fechaNac.getMonth(),
      fechaNac.getDate()
    );

    // Si la fecha actual es igual o posterior a la fecha de mayoría de edad, es True (Mayor de edad).
    return fechaActual >= mayoriaEdad;
  }
}
