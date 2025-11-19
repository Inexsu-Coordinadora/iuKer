import { IConsultaCitasPacienteCasosUso } from './IConsultaCitasPacienteCasosUso.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { IPacientesRepositorio } from '../../../dominio/Paciente/IPacientesRepositorio.js';
import { ICitasMedicasRepositorio } from '../../../dominio/CitaMedica/ICitasMedicasRepositorio.js';

export class ConsultaPacienteCasosUso implements IConsultaCitasPacienteCasosUso {
  constructor(
    private pacientesRepositorio: IPacientesRepositorio,
    private citasMedicasRepositorio: ICitasMedicasRepositorio
  ) {}

  async ejecutarServicio(numeroDocPaciente: string, limite?: number): Promise<citaMedicaDTO[]> {
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
