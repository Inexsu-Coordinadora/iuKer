import { conversionAFechaColombia } from '../../../../common/conversionAFechaColombia.js';
import { CitaMedica } from '../../../dominio/citaMedica/CitaMedica.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { IMedicosRepositorio } from '../../../dominio/medico/IMedicosRepositorio.js';
import { IPacientesRepositorio } from '../../../dominio/paciente/IPacientesRepositorio.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { CitaMedicaResumenDTO } from '../../../infraestructura/repositorios/postgres/dtos/citaMedicaResumenDTO.js';
import { IAgendamientoCitasCasosUso } from './IAgendamientoCitasCasosUso.js';

export class AgendamientoCitasCasosUso implements IAgendamientoCitasCasosUso {
  constructor(
    private citasMedicasRepositorio: ICitasMedicasRepositorio,
    private medicosRepositorio: IMedicosRepositorio,
    private pacientesRepositorio: IPacientesRepositorio
  ) {}

  async ejecutar(datosCitaMedica: citaMedicaDTO): Promise<CitaMedicaResumenDTO | null> {
    await this.validarPaciente(datosCitaMedica.numeroDocPaciente);
    await this.validarMedico(datosCitaMedica.medico);
    this.validarFechaVigente(datosCitaMedica.fecha, datosCitaMedica.horaInicio);
    await this.validarTurnoMedico(datosCitaMedica.medico, datosCitaMedica.fecha, datosCitaMedica.horaInicio);
    await this.validarDisponibilidadMedico(datosCitaMedica.medico, datosCitaMedica.fecha, datosCitaMedica.horaInicio);
    await this.validarCitasPaciente(
      datosCitaMedica.tipoDocPaciente,
      datosCitaMedica.numeroDocPaciente,
      datosCitaMedica.fecha,
      datosCitaMedica.horaInicio
    );

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

  private validarFechaVigente(fecha: string, horaInicio: string): void {
    const fechaCita = conversionAFechaColombia(fecha, horaInicio);
    if (fechaCita < new Date()) throw new Error('No se puede agendar una cita en el pasado');
  }

  private async validarDisponibilidadMedico(medico: string, fecha: string, horaInicio: string): Promise<void> {
    const medicoDisponible = await this.citasMedicasRepositorio.validarDisponibilidadMedico(medico, fecha, horaInicio);

    if (medicoDisponible)
      throw new Error(
        `El medico con tarjeta profesional '${medico}' ya tiene programada una cita para la hora indicada`
      );
  }

  private async validarTurnoMedico(medico: string, fecha: string, horaInicio: string): Promise<void> {
    const turnoExistente = await this.citasMedicasRepositorio.validarTurnoMedico(medico, fecha, horaInicio);

    if (!turnoExistente)
      throw new Error(`El médico con tarjeta profesional '${medico}' no se encuentra disponible en ese horario`);
  }

  private async validarCitasPaciente(
    tipoDocPaciente: number,
    numeroDocPaciente: string,
    fecha: string,
    horaInicio: string
  ): Promise<void> {
    const validarCitas = await this.citasMedicasRepositorio.validarCitasPaciente(
      tipoDocPaciente,
      numeroDocPaciente,
      fecha,
      horaInicio
    );

    if (validarCitas)
      throw new Error(
        `No se puede agendar la cita porque el paciente con ID '${numeroDocPaciente}' ya tiene una cita agendada en ese horario`
      );
  }
}
