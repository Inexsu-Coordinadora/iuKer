import { IPacientesCasosUso } from './IPacientesCasosUso.js';
import { IRepositorioPacientes } from '../../dominio/Paciente/IPacientesRepositorio.js';
import { IPaciente } from '../../dominio/Paciente/IPaciente.js';
import { Paciente } from '../../dominio/Paciente/Paciente.js';

export class PacientesCasosUso implements IPacientesCasosUso {
  constructor(private repositorioPacientes: IRepositorioPacientes) {}

  async obtenerPacientes(limite?: number): Promise<IPaciente[]> {
    return await this.repositorioPacientes.obtenerPacientes(limite);
  }

  async obtenerPacientePorId(numeroDoc: string): Promise<Paciente> {
    const pacienteObtenido = await this.repositorioPacientes.obtenerPacientePorId(numeroDoc);

    return pacienteObtenido;
  }

  async crearPaciente(nuevoPaciente: IPaciente): Promise<string> {
    const instanciaPaciente = new Paciente(nuevoPaciente);

    const idNuevoPaciente = await this.repositorioPacientes.crearPaciente(instanciaPaciente);

    return idNuevoPaciente;
  }

  async actualizarPaciente(numeroDoc: string, paciente: Paciente): Promise<IPaciente> {
    const pacienteActualizado = await this.repositorioPacientes.actualizarPaciente(numeroDoc, paciente);
    return pacienteActualizado || null;
  }

  async borrarPaciente(numeroDoc: string): Promise<void> {
    await this.repositorioPacientes.borrarPaciente(numeroDoc);
  }
}
