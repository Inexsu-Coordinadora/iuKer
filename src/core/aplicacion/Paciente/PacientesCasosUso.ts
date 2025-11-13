import { IPacientesCasosUso } from './IPacientesCasosUso.js';
import { IPaciente } from '../../dominio/Paciente/IPaciente.js';
import { Paciente } from '../../dominio/Paciente/Paciente.js';
import { IPacientesRepositorio } from '../../dominio/Paciente/IPacientesRepositorio.js';

export class PacientesCasosUso implements IPacientesCasosUso {
  constructor(private pacientesRepositorio: IPacientesRepositorio) {}

  async obtenerPacientes(limite?: number): Promise<IPaciente[]> {
    return await this.pacientesRepositorio.obtenerPacientes(limite);
  }

  async obtenerPacientePorId(numeroDoc: string): Promise<Paciente> {
    const pacienteObtenido = await this.pacientesRepositorio.obtenerPacientePorId(numeroDoc);

    return pacienteObtenido;
  }

  async crearPaciente(nuevoPaciente: IPaciente): Promise<string> {
    const instanciaPaciente = new Paciente(nuevoPaciente);

    const existePaciente = await this.pacientesRepositorio.existePacientePorDocumento(
      nuevoPaciente.numeroDoc,
      nuevoPaciente.tipoDoc
    );

    if (existePaciente) {
      throw new Error(
        `El paciente con documento ${instanciaPaciente.numeroDoc} y tipo ${instanciaPaciente.tipoDoc} ya existe en el sistema.`
      );
    }

    const idNuevoPaciente = await this.pacientesRepositorio.crearPaciente(instanciaPaciente);

    return idNuevoPaciente;
  }

  async actualizarPaciente(numeroDoc: string, paciente: Paciente): Promise<IPaciente> {
    const pacienteActualizado = await this.pacientesRepositorio.actualizarPaciente(numeroDoc, paciente);
    return pacienteActualizado || null;
  }

  async borrarPaciente(numeroDoc: string): Promise<void> {
    await this.pacientesRepositorio.borrarPaciente(numeroDoc);
  }
}
