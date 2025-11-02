import { IPaciente } from './IPaciente.js';

export interface IRepositorioPacientes {
  obtenerPacientes(limite?: number): Promise<IPaciente[]>;
  obtenerPacientePorId(idPaciente: string): Promise<IPaciente>;
  crearPaciente(nuevoPaciente: IPaciente): Promise<string>;
  actualizarPaciente(
    idPaciente: string,
    paciente: IPaciente
  ): Promise<IPaciente>;
  borrarPaciente(idPaciente: string): Promise<void>;
}
