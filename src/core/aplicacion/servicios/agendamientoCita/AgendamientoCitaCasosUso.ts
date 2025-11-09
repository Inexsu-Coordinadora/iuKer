import { CitaMedica } from '../../../dominio/CitaMedica/CitaMedica.js';
import { ICitaMedica } from '../../../dominio/CitaMedica/ICitaMedica.js';
import { IRepositorioCitaMedica } from '../../../dominio/CitaMedica/IRepositorioCitaMedica.js';
import { IMedicoRepositorio } from '../../../dominio/Medico/IMedicoRepositorio.js';
import { IRepositorioPacientes } from '../../../dominio/Paciente/IRepositorioPacientes.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { IAgendamientoCitaCasosUso } from './IAgendamientoCitaCasosUso.js';

export class AgendamientoCitaCasosUso implements IAgendamientoCitaCasosUso {
  constructor(
    private citasMedicasRepositorio: IRepositorioCitaMedica,
    private medicoRepositorio: IMedicoRepositorio,
    private pacientesRepositorio: IRepositorioPacientes
  ) {}

  async ejecutar(datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica> {
    await this.validarPaciente(datosCitaMedica.numeroDocPaciente);
    await this.validarMedico(datosCitaMedica.medico);

    const citaAgendada = new CitaMedica(datosCitaMedica);

    return await this.citasMedicasRepositorio.agendarCita(citaAgendada);
  }

  private async validarPaciente(idPaciente: string): Promise<void> {
    const paciente = await this.pacientesRepositorio.obtenerPacientePorId(idPaciente);

    if (!paciente) throw new Error(`El paciente con ID ${idPaciente} no se encuentra afiliado a este sistema de salud`);
  }

  private async validarMedico(idMedico: string): Promise<void> {
    const medico = await this.medicoRepositorio.obtenerMedicoPorTarjetaProfesional(idMedico);

    if (!medico)
      throw new Error(`El medico con tajerta profesional ${idMedico} no hace parte de este sistema de salud`);
  }
}
