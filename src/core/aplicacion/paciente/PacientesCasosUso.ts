import { IPacientesCasosUso } from './IPacientesCasosUso.js';
import { IPaciente } from '../../dominio/paciente/IPaciente.js';
import { Paciente } from '../../dominio/paciente/Paciente.js';
import { IPacientesRepositorio } from '../../dominio/paciente/IPacientesRepositorio.js';
import { ICitasMedicasRepositorio } from '../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { pacienteRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/pacienteRespuestaDTO.js';

export class PacientesCasosUso implements IPacientesCasosUso {
  constructor(
    private pacientesRepositorio: IPacientesRepositorio,
    private citasMedicasRepositorio: ICitasMedicasRepositorio
  ) {}

  async obtenerPacientes(limite?: number): Promise<pacienteRespuestaDTO[]> {
    return await this.pacientesRepositorio.obtenerPacientes(limite);
  }

  async obtenerPacientePorId(numeroDoc: string): Promise<pacienteRespuestaDTO | null> {
    const pacienteObtenido = await this.pacientesRepositorio.obtenerPacientePorId(numeroDoc);

    return pacienteObtenido;
  }

  async crearPaciente(nuevoPaciente: IPaciente): Promise<pacienteRespuestaDTO | null> {
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

    const pacienteCreado = await this.pacientesRepositorio.crearPaciente(instanciaPaciente);
    return pacienteCreado;
  }

  async actualizarPaciente(numeroDoc: string, paciente: Paciente): Promise<pacienteRespuestaDTO | null> {
    const pacienteActualizado = await this.pacientesRepositorio.actualizarPaciente(numeroDoc, paciente);
    return pacienteActualizado || null;
  }

  async borrarPaciente(numeroDocPaciente: string): Promise<void> {
    const datosCitaAEliminar = await this.obtenerPacientePorId(numeroDocPaciente);

    if (datosCitaAEliminar?.tipoDocPaciente) {
      await this.citasMedicasRepositorio.eliminarCitasPorPaciente(
        datosCitaAEliminar.tipoDocPaciente,
        numeroDocPaciente
      );
    }
    await this.pacientesRepositorio.borrarPaciente(numeroDocPaciente);
  }
}
