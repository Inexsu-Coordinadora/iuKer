import { IPacientesCasosUso } from './IPacientesCasosUso.js';
import { IPaciente } from '../../dominio/paciente/IPaciente.js';
import { Paciente } from '../../dominio/paciente/Paciente.js';
import { IPacientesRepositorio } from '../../dominio/paciente/IPacientesRepositorio.js';
import { crearErrorDeDominio } from '../../dominio/errores/manejoDeErrores.js';
import { CodigosDeError } from '../../dominio/errores/codigosDeError.enum.js';

export class PacientesCasosUso implements IPacientesCasosUso {
  constructor(private pacientesRepositorio: IPacientesRepositorio) {}

  async obtenerPacientes(limite?: number): Promise<IPaciente[]> {
    return await this.pacientesRepositorio.obtenerPacientes(limite);
  }

  async obtenerPacientePorId(numeroDoc: string): Promise<Paciente> {
    const pacienteObtenido =
      await this.pacientesRepositorio.obtenerPacientePorId(numeroDoc);

    if (!pacienteObtenido) {
      throw crearErrorDeDominio(CodigosDeError.PACIENTE_NO_EXISTE);
    }

    return pacienteObtenido;
  }

  async crearPaciente(nuevoPaciente: IPaciente): Promise<string> {
    const instanciaPaciente = new Paciente(nuevoPaciente);

    const existePaciente =
      await this.pacientesRepositorio.existePacientePorDocumento(
        nuevoPaciente.numeroDoc,
        nuevoPaciente.tipoDoc
      );

    if (existePaciente) {
      throw crearErrorDeDominio(CodigosDeError.PACIENTE_YA_EXISTE);
    }

    const idNuevoPaciente = await this.pacientesRepositorio.crearPaciente(
      instanciaPaciente
    );

    return idNuevoPaciente;
  }

  async actualizarPaciente(
    numeroDoc: string,
    paciente: Paciente
  ): Promise<IPaciente> {
    const pacienteExiste = await this.pacientesRepositorio.obtenerPacientePorId(
      numeroDoc
    );

    if (!pacienteExiste) {
      throw crearErrorDeDominio(CodigosDeError.PACIENTE_NO_EXISTE);
    }

    const pacienteActualizado =
      await this.pacientesRepositorio.actualizarPaciente(numeroDoc, paciente);
    return pacienteActualizado || null;
  }

  async borrarPaciente(numeroDoc: string): Promise<void> {
    await this.pacientesRepositorio.borrarPaciente(numeroDoc);
  }
}
