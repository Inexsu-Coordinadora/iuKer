import { IPacientesCasosUso } from './IPacientesCasosUso.js';
import { IRepositorioPacientes } from '../../dominio/Paciente/IRepositorioPacientes.js';
import { IPaciente } from '../../dominio/Paciente/IPaciente.js';
import { Paciente } from '../../dominio/Paciente/Paciente.js';

export class PacientesCasosUso implements IPacientesCasosUso {
  constructor(private repositorioPacientes: IRepositorioPacientes) {}

  async obtenerPacientes(limite?: number): Promise<IPaciente[]> {
    return await this.repositorioPacientes.obtenerPacientes(limite);
  }

  async obtenerPacientePorId(numeroDoc: string): Promise<Paciente> {
    const pacienteObtenido =
      await this.repositorioPacientes.obtenerPacientePorId(numeroDoc);

    return pacienteObtenido;
  }

  async crearPaciente(nuevoPaciente: IPaciente): Promise<string> {
    // Implementar validar reglas puras del Dominio (ej: formato de email, fecha de nacimiento)
    // El constructor de Paciente lanzará un error si los datos son inválidos.
    const instanciaPaciente = new Paciente(nuevoPaciente);

    // 2. VALIDACIÓN DE UNICIDAD (Regla de Negocio de Aplicación)
    const existePaciente =
      await this.repositorioPacientes.existePacientePorDocumento(
        nuevoPaciente.numeroDoc,
        nuevoPaciente.tipoDoc
      );

    if (existePaciente) {
      throw new Error(
        `El paciente con documento ${instanciaPaciente.numeroDoc} y tipo ${instanciaPaciente.tipoDoc} ya existe en el sistema.`
      );
    }

    const idNuevoPaciente = await this.repositorioPacientes.crearPaciente(
      instanciaPaciente
    );

    return idNuevoPaciente;
  }

  async actualizarPaciente(
    numeroDoc: string,
    paciente: Paciente
  ): Promise<IPaciente> {
    const pacienteActualizado =
      await this.repositorioPacientes.actualizarPaciente(numeroDoc, paciente);
    return pacienteActualizado || null;
  }

  async borrarPaciente(numeroDoc: string): Promise<void> {
    await this.repositorioPacientes.borrarPaciente(numeroDoc);
  }
}
