import { conversionAFechaColombia } from '../../../../common/conversionAFechaColombia.js';
import { ICitaMedica } from '../../../dominio/citaMedica/ICitaMedica.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { IMedicosRepositorio } from '../../../dominio/medico/IMedicosRepositorio.js';
import { citaMedicaSolicitudDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { ICancelacionReprogramacionCitasCasosUso } from './ICancelacionReprogramacionCitasCasosUso.js';
import { estadoCita } from '../../../../common/estadoCita.enum.js';
import { CitaMedicaRespuestaDTO } from '../../../infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';

export class CancelacionReprogramacionCitasCasosUso implements ICancelacionReprogramacionCitasCasosUso {
  constructor(
    private citasMedicasRepositorio: ICitasMedicasRepositorio,
    private medicosRepositorio: IMedicosRepositorio
  ) {}

  async cancelarCita(idCita: string): Promise<CitaMedicaRespuestaDTO | null> {
    // Verificar que la cita existe
    const citaExistente = await this.citasMedicasRepositorio.obtenerCitaPorId(idCita);

    if (!citaExistente) {
      throw new Error(`No puede cancelar la cita con id '${idCita}' porque no existe en el sistema`);
    }

    // Verificar que la cita no esté ya cancelada o finalizada
    if (citaExistente.codigoEstadoCita === estadoCita.CANCELADA) {
      throw new Error(`La cita con id '${idCita}' ya está cancelada`);
    }

    if (citaExistente.codigoEstadoCita === estadoCita.FINALIZADA) {
      throw new Error(`No puede cancelar la cita con id '${idCita}' porque ya fue finalizada`);
    }

    return await this.citasMedicasRepositorio.cancelarCita(idCita);
  }
  // Reprograma una cita existente
  async reprogramarCita(idCita: string, nuevosDatos: citaMedicaSolicitudDTO): Promise<CitaMedicaRespuestaDTO | null> {
    const citaExistente = await this.citasMedicasRepositorio.obtenerCitaPorId(idCita);

    const fechaColombia = conversionAFechaColombia(nuevosDatos.fecha, nuevosDatos.horaInicio);
    if (fechaColombia < new Date()) throw new Error('No se puede agendar una cita en el pasado');

    if (!citaExistente) {
      throw new Error(`No puede reprogramar la cita con id '${idCita}' porque no existe en el sistema`);
    }

    if (citaExistente.codigoEstadoCita === estadoCita.CANCELADA) {
      throw new Error('No puede reprogramar una cita cancelada');
    }

    if (citaExistente.codigoEstadoCita === estadoCita.FINALIZADA) {
      throw new Error('No puede reprogramar una cita finalizada');
    }
    // verificar que el medico si existe
    const medicoExiste = await this.medicosRepositorio.obtenerMedicoPorTarjetaProfesional(nuevosDatos.medico);
    if (!medicoExiste) {
      throw new Error('El médico asignado no existe en el sistema');
    }
    // Validar disponibilidad del médico (turno asignado)
    const disponible = await this.citasMedicasRepositorio.validarTurnoMedico(
      nuevosDatos.medico,
      nuevosDatos.fecha,
      nuevosDatos.horaInicio
    );

    if (!disponible) {
      throw new Error('El médico no tiene un turno asignado para el día y horario solicitado');
    }
    // Validar traslape del paciente (excluyendo la cita actual)
    const traslapePaciente = await this.citasMedicasRepositorio.validarCitasPaciente(
      nuevosDatos.tipoDocPaciente,
      nuevosDatos.numeroDocPaciente,
      nuevosDatos.fecha,
      nuevosDatos.horaInicio,
      idCita
    );

    if (traslapePaciente) {
      throw new Error('El paciente ya tiene una cita programada en ese horario');
    }

    // Validar traslape del médico (excluyendo la cita actual)
    const traslapeMedico = await this.citasMedicasRepositorio.validarDisponibilidadMedico(
      nuevosDatos.medico,
      nuevosDatos.fecha,
      nuevosDatos.horaInicio,
      idCita
    );

    if (traslapeMedico) {
      throw new Error('El médico ya tiene una cita programada en ese horario');
    }

    // Crear objeto con los nuevos datos de la cita
    const nuevaCita: ICitaMedica = {
      medico: nuevosDatos.medico,
      tipoDocPaciente: nuevosDatos.tipoDocPaciente,
      numeroDocPaciente: nuevosDatos.numeroDocPaciente,
      fecha: nuevosDatos.fecha,
      horaInicio: nuevosDatos.horaInicio,
      estado: estadoCita.ACTIVADA,
      idCitaAnterior: idCita,
    };

    // Reprogramar (marca la anterior como reprogramada y crea la nueva)
    return await this.citasMedicasRepositorio.reprogramarCita(idCita, nuevaCita);
  }
  async finalizarCita(idCita: string): Promise<CitaMedicaRespuestaDTO | null> {
    const cita = await this.citasMedicasRepositorio.obtenerCitaPorId(idCita);

    if (!cita) {
      throw new Error('La cita no existe en el sistema');
    }
    if (cita.codigoEstadoCita === estadoCita.REPROGRAMADA) {
      throw new Error('No se puede finalizar una cita no vigente');
    }
    if (cita?.codigoEstadoCita === estadoCita.CANCELADA) {
      throw new Error('No se puede finalizar una cita cancelada');
    }
    if (cita?.codigoEstadoCita === estadoCita.FINALIZADA) {
      throw new Error('La cita ya fue finalizada anteriormente');
    }
    return await this.citasMedicasRepositorio.finalizarCita(idCita);
  }
}
