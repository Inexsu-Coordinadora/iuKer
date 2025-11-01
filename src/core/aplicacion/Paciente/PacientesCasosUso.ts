import { IPacientesCasosUso } from './IPacientesCasosUso.js';
import { IRepositrioPacientes } from '../../dominio/Paciente/IRepositorioPacientes.js';
import { IPaciente } from '../../dominio/Paciente/IPaciente.js';

export class PacientesCasosUso implements IPacientesCasosUso {
  constructor(private repositorioPacientes: IRepositrioPacientes) {}

  async obtenerPacientes(limite?: number): Promise<IPaciente[]> {
    return await this.repositorioPacientes.obtenerPacientes(limite);
  }

  async obtenerPacientePorId(idPaciente: string): Promise<IPaciente> {
    const pacienteObtenido =
      await this.repositorioPacientes.obtenerPacientePorId(idPaciente);

    return pacienteObtenido;
  }

  async crearPaciente(nuevoPaciente: IPaciente): Promise<string> {
    const idNuevoPaciente = await this.repositorioPacientes.crearPaciente(
      nuevoPaciente
    );
    return idNuevoPaciente;
  }

  async actualizarPaciente(
    idPaciente: string,
    paciente: IPaciente
  ): Promise<IPaciente> {
    const pacienteActualizado =
      await this.repositorioPacientes.actualizarPaciente(idPaciente, paciente);
    return pacienteActualizado || null;
  }

  async borrarPaciente(idPaciente: string): Promise<void> {
    await this.repositorioPacientes.borrarPaciente(idPaciente);
  }
}
