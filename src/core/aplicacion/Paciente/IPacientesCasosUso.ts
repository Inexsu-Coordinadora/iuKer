import { IPaciente } from '../../dominio/Paciente/IPaciente.js';

export interface IPacientesCasosUso {
  obtenerPacientes(limite?: number): Promise<IPaciente[]>;
  obtenerPacientePorId(idPaciente: string): Promise<IPaciente>;
  crearPaciente(nuevoPaciente: IPaciente): Promise<string>;
  actualizarPaciente(
    idPaciente: string,
    paciente: IPaciente
  ): Promise<IPaciente>;
  borrarPaciente(idPaciente: string): Promise<void>;
}
