import { conversionAFechaColombia } from '../../../../common/conversionAFechaColombia.js';
import { ICitaMedica } from '../../../dominio/CitaMedica/ICitaMedica.js';
import { IRepositorioCitaMedica } from '../../../dominio/CitaMedica/IRepositorioCitaMedica.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { ICancelacionReprogramacionCitaServicio } from './ICancelacionReprogramacionCitaCasosUso.js';
import { MedicosRepositorio } from '../../../infraestructura/postgres/MedicosRepositorio.js';
import { estadoCita } from '../../../../common/estadoCita.enum.js';
export class CancelacionReprogramacionCitaServicio implements ICancelacionReprogramacionCitaServicio {
  constructor(private citasMedicasRepositorio: IRepositorioCitaMedica) {}

  async cancelarCita(idCita: string): Promise<ICitaMedica> {
    // Verificar que la cita existe
    const citaExistente = await this.citasMedicasRepositorio.obtenerCitaPorId(idCita);

    if (!citaExistente) {
      throw new Error(
        `No puede cancelar la cita con id '${idCita}' porque no existe en el sistema`
      );
    }

    // Verificar que la cita no esté ya cancelada o finalizada
    if (citaExistente.estado === estadoCita.CANCELADA) {
      throw new Error(`La cita con id '${idCita}' ya está cancelada`);
    }

    if (citaExistente.estado === estadoCita.FINALIZADA) {
      throw new Error(`No puede cancelar la cita con id '${idCita}' porque ya fue finalizada`);
    }

    return await this.citasMedicasRepositorio.cancelarCita(idCita);
  }
  // Reprograma una cita existente
  async reprogramarCita(idCita: string, nuevosDatos: citaMedicaDTO): Promise<ICitaMedica> {
    const citaExistente = await this.citasMedicasRepositorio.obtenerCitaPorId(idCita);

    const fechaColombia = conversionAFechaColombia(nuevosDatos.fecha, nuevosDatos.horaInicio);
    if (fechaColombia < new Date()) throw new Error('No se puede agendar una cita en el pasado');

    if (!citaExistente) {
      throw new Error(
        `No puede reprogramar la cita con id '${idCita}' porque no existe en el sistema`
      );
    }

    if (citaExistente.estado === estadoCita.CANCELADA) {
      throw new Error('No puede reprogramar una cita cancelada');
    }

    if (citaExistente.estado === estadoCita.FINALIZADA) {
      throw new Error('No puede reprogramar una cita finalizada');
    }
    // verificar que el medico si existe
    const medicoRepositorio = new MedicosRepositorio();
    const medicoExiste = await medicoRepositorio.obtenerMedicoPorTarjetaProfesional(nuevosDatos.medico);
    if (!medicoExiste){
      throw new Error('El médico asignado no existe en el sistema');
    }
    // Validar disponibilidad del médico (turno asignado)
    const disponible = await this.citasMedicasRepositorio.validarTurnoMedico(nuevosDatos);

    if (!disponible) {
      throw new Error(
        'El médico no tiene un turno asignado para el día y horario solicitado'
      );
    }
    // Validar traslape del paciente (excluyendo la cita actual)
    const traslapePaciente = await this.citasMedicasRepositorio.verificarTraslapePaciente(
      nuevosDatos.tipoDocPaciente,
      nuevosDatos.numeroDocPaciente,
      nuevosDatos.fecha,
      nuevosDatos.horaInicio,
      idCita
    );

    if (traslapePaciente.hayTraslape) {
      throw new Error(
        'El paciente ya tiene una cita programada en ese horario'
      );
    }

    // Validar traslape del médico (excluyendo la cita actual)
    const traslapeMedico = await this.citasMedicasRepositorio.verificarTraslapeMedico(
      nuevosDatos.medico,
      nuevosDatos.fecha,
      nuevosDatos.horaInicio,
      idCita
    );

    if (traslapeMedico.hayTraslape) {
      throw new Error(
        'El médico ya tiene una cita programada en ese horario'
      );
    }

    // Crear objeto con los nuevos datos de la cita
    const nuevaCita: ICitaMedica = {
      medico: nuevosDatos.medico,
      tipoDocPaciente: nuevosDatos.tipoDocPaciente,
      numeroDocPaciente: nuevosDatos.numeroDocPaciente,
      fecha: nuevosDatos.fecha,
      horaInicio: nuevosDatos.horaInicio,
      estado: 1,
      idCitaAnterior: idCita
    };

    // Reprogramar (marca la anterior como reprogramada y crea la nueva)
    return await this.citasMedicasRepositorio.reprogramarCita(idCita, nuevaCita);
  }
  async finalizarCita(idCita:string): Promise<ICitaMedica> {
    const cita = await this.citasMedicasRepositorio.obtenerCitaPorId(idCita)
    if (!cita){
      throw new Error('La cita no existe en el sistema');
    }
    if (cita.estado === estadoCita.REPROGRAMADA){
      throw new Error('No se puede finalizar una cita no vigente');
    }
    if (cita?.estado === estadoCita.CANCELADA){
      throw new Error('No se puede finalizar una cita cancelada');
    }
    if (cita?.estado === estadoCita.FINALIZADA){
      throw new Error('La cita ya fue finalizada anteriormente');
    }
    return await this.citasMedicasRepositorio.finalizarCita(idCita);
  }
}