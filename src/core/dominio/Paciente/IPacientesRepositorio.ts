import { IPaciente } from './IPaciente.js';

export interface IPacientesRepositorio {
  obtenerPacientes(limite?: number): Promise<IPaciente[]>;
  obtenerPacientePorId(numeroDoc: string): Promise<IPaciente>;
  crearPaciente(nuevoPaciente: IPaciente): Promise<string>;
  actualizarPaciente(numeroDoc: string, paciente: IPaciente): Promise<IPaciente>;
  borrarPaciente(numeroDoc: string): Promise<void>;
}
