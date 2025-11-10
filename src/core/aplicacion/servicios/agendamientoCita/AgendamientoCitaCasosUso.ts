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
    private medicosRepositorio: IMedicoRepositorio,
    private pacientesRepositorio: IRepositorioPacientes
  ) {}

  async ejecutar(datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica> {
    await this.validarPaciente(datosCitaMedica.numeroDocPaciente);
    await this.validarTurnoMedico(datosCitaMedica);
    await this.validarMedico(datosCitaMedica.medico);
    await this.disponibilidadMedico(datosCitaMedica);
    await this.validarCitasPaciente(datosCitaMedica);

    const citaAgendada = new CitaMedica(datosCitaMedica);

    return await this.citasMedicasRepositorio.agendarCita(citaAgendada);
  }

  private async validarPaciente(idPaciente: string): Promise<void> {
    const paciente = await this.pacientesRepositorio.obtenerPacientePorId(idPaciente);

    if (!paciente) throw new Error(`El paciente con ID ${idPaciente} no se encuentra afiliado a este sistema de salud`);
  }

  private async validarMedico(idMedico: string): Promise<void> {
    const medico = await this.medicosRepositorio.obtenerMedicoPorTarjetaProfesional(idMedico);

    if (!medico)
      throw new Error(`El medico con tajerta profesional ${idMedico} no hace parte de este sistema de salud`);
  }

  private async disponibilidadMedico(datosCitaMedica: citaMedicaDTO): Promise<void> {
    const medicoDisponible = await this.citasMedicasRepositorio.disponibilidadMedico(datosCitaMedica);

    if (medicoDisponible)
      throw new Error(`El medico ${datosCitaMedica.medico} ya tiene programada una cita para la hora indicada`);
  }

  private async validarTurnoMedico(datosCitaMedica: citaMedicaDTO): Promise<void> {
    const turnoExistente = await this.citasMedicasRepositorio.validarTurnoMedico(datosCitaMedica);

    if (!turnoExistente)
      throw new Error(
        `El medico ${datosCitaMedica.medico} no se encuentra disponible ese día en el horario que usted desea`
      );
  }

  private async validarCitasPaciente(datosCitaMedica: citaMedicaDTO): Promise<void> {
    const validarCitas = await this.citasMedicasRepositorio.validarCitasPaciente(datosCitaMedica);

    if (validarCitas)
      throw new Error(
        `No se puede agendar la cita porque el paciente ${datosCitaMedica.numeroDocPaciente} ya tiene una cita agendada en ese horario`
      );
  }
}
