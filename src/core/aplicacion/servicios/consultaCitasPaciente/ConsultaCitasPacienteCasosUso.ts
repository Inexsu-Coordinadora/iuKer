import { IConsultaCitasPacienteCasosUso } from './IConsultaCitasPacienteCasosUso.js';
import { citaMedicaSolicitudDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { IPacientesRepositorio } from '../../../dominio/paciente/IPacientesRepositorio.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';

export class ConsultaPacienteCasosUso implements IConsultaCitasPacienteCasosUso {
  constructor(
    private pacientesRepositorio: IPacientesRepositorio,
    private citasMedicasRepositorio: ICitasMedicasRepositorio
  ) {}

  async ejecutarServicio(numeroDocPaciente: string, limite?: number): Promise<citaMedicaSolicitudDTO[]> {
    const paciente = await this.pacientesRepositorio.obtenerPacientePorId(numeroDocPaciente);

    if (!paciente) {
      throw new Error(`El paciente con documento '${numeroDocPaciente}' no existe`);
    }

    const citasPorPaciente = await this.citasMedicasRepositorio.obtenerCitasPorPaciente(numeroDocPaciente, limite);

    if (limite) {
      return citasPorPaciente.slice(0, limite);
    }
    return citasPorPaciente;
  }
}
