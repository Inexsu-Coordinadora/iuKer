import { conversionAFechaColombia } from '../../../../common/conversionAFechaColombia.js';
import { CitaMedica } from '../../../dominio/citaMedica/CitaMedica.js';
import { ICitaMedica } from '../../../dominio/citaMedica/ICitaMedica.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { IMedicosRepositorio } from '../../../dominio/medico/IMedicosRepositorio.js';
import { IPacientesRepositorio } from '../../../dominio/paciente/IPacientesRepositorio.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { IAgendamientoCitasCasosUso } from './IAgendamientoCitasCasosUso.js';

export class AgendamientoCitasCasosUso implements IAgendamientoCitasCasosUso {
  constructor(
    private citasMedicasRepositorio: ICitasMedicasRepositorio,
    private medicosRepositorio: IMedicosRepositorio,
    private pacientesRepositorio: IPacientesRepositorio
  ) {}

  async ejecutar(datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica> {
    await this.validarPaciente(datosCitaMedica.numeroDocPaciente);
    await this.validarMedico(datosCitaMedica.medico);
    this.validarFechaVigente(datosCitaMedica);
    await this.validarTurnoMedico(datosCitaMedica);
    await this.disponibilidadMedico(datosCitaMedica);
    await this.validarCitasPaciente(datosCitaMedica);

    const citaAgendada = new CitaMedica(datosCitaMedica);

    return await this.citasMedicasRepositorio.agendarCita(citaAgendada);
  }

  private async validarPaciente(idPaciente: string): Promise<void> {
    const paciente = await this.pacientesRepositorio.obtenerPacientePorId(idPaciente);

    if (!paciente) throw new Error(`El paciente con ID '${idPaciente}' no existe en el sistema`);
  }

  private async validarMedico(idMedico: string): Promise<void> {
    const medico = await this.medicosRepositorio.obtenerMedicoPorTarjetaProfesional(idMedico);

    if (!medico) throw new Error(`El medico con tajerta profesional '${idMedico}' no existe en el sistema`);
  }

  private validarFechaVigente(datosCitaMedica: citaMedicaDTO): void {
    const fechaCita = conversionAFechaColombia(datosCitaMedica.fecha, datosCitaMedica.horaInicio);
    if (fechaCita < new Date()) throw new Error('No se puede agendar una cita en el pasado');
  }

  private async disponibilidadMedico(datosCitaMedica: citaMedicaDTO): Promise<void> {
    const medicoDisponible = await this.citasMedicasRepositorio.validarDisponibilidadMedico(datosCitaMedica);

    if (medicoDisponible)
      throw new Error(`El medico '${datosCitaMedica.medico}' ya tiene programada una cita para la hora indicada`);
  }

  private async validarTurnoMedico(datosCitaMedica: citaMedicaDTO): Promise<void> {
    const turnoExistente = await this.citasMedicasRepositorio.validarTurnoMedico(datosCitaMedica);

    if (!turnoExistente)
      throw new Error(
        `El médico con tarjeta profesional '${datosCitaMedica.medico} no se encuentra disponible en ese horario'`
      );
  }

  private async validarCitasPaciente(datosCitaMedica: citaMedicaDTO): Promise<void> {
    const validarCitas = await this.citasMedicasRepositorio.validarCitasPaciente(datosCitaMedica);

    if (validarCitas)
      throw new Error(
        `No se puede agendar la cita porque el paciente con ID '${datosCitaMedica.numeroDocPaciente}' ya tiene una cita agendada en ese horario`
      );
  }
}
