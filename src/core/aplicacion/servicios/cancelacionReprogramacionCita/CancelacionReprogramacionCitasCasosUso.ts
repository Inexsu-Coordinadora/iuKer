import { conversionAFechaColombia } from '../../../../common/conversionAFechaColombia.js';
import { ICitaMedica } from '../../../dominio/citaMedica/ICitaMedica.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { IMedicosRepositorio } from '../../../dominio/medico/IMedicosRepositorio.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { ICancelacionReprogramacionCitasCasosUso } from './ICancelacionReprogramacionCitasCasosUso.js';
import { estadoCita } from '../../../../common/estadoCita.enum.js';
import { crearErrorDeDominio } from '../../../dominio/errores/manejoDeErrores.js';
import { CodigosDeError } from '../../../dominio/errores/codigosDeError.enum.js';

export class CancelacionReprogramacionCitasCasosUso
  implements ICancelacionReprogramacionCitasCasosUso
{
  constructor(
    private citasMedicasRepositorio: ICitasMedicasRepositorio,
    private medicosRepositorio: IMedicosRepositorio
  ) {}

  async cancelarCita(idCita: string): Promise<ICitaMedica> {
    // Verificar que la cita existe
    const citaExistente = await this.citasMedicasRepositorio.obtenerCitaPorId(
      idCita
    );

    if (!citaExistente) {
      throw crearErrorDeDominio(CodigosDeError.CITA_NO_EXISTE);
    }

    // Verificar que la cita no esté ya cancelada o finalizada
    if (citaExistente.estado === estadoCita.CANCELADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_CANCELADA);
    }

    if (citaExistente.estado === estadoCita.FINALIZADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_FINALIZADA);
    }

    return await this.citasMedicasRepositorio.cancelarCita(idCita);
  }
  // Reprograma una cita existente
  async reprogramarCita(
    idCita: string,
    nuevosDatos: citaMedicaDTO
  ): Promise<ICitaMedica> {
    const citaExistente = await this.citasMedicasRepositorio.obtenerCitaPorId(
      idCita
    );

    const fechaColombia = conversionAFechaColombia(
      nuevosDatos.fecha,
      nuevosDatos.horaInicio
    );
    if (fechaColombia < new Date())
      throw crearErrorDeDominio(CodigosDeError.AGENDADANDO_CITA_EN_EL_PASADO);

    if (!citaExistente) {
      throw crearErrorDeDominio(CodigosDeError.CITA_NO_EXISTE);
    }

    if (citaExistente.estado === estadoCita.CANCELADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_CANCELADA);
    }

    if (citaExistente.estado === estadoCita.FINALIZADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_FINALIZADA);
    }
    // verificar que el medico si existe
    const medicoExiste =
      await this.medicosRepositorio.obtenerMedicoPorTarjetaProfesional(
        nuevosDatos.medico
      );
    if (!medicoExiste) {
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_EXISTE);
    }
    // Validar disponibilidad del médico (turno asignado)
    const disponible = await this.citasMedicasRepositorio.validarTurnoMedico(
      nuevosDatos
    );

    if (!disponible) {
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_DISPONIBLE);
    }
    // Validar traslape del paciente (excluyendo la cita actual)
    const traslapePaciente =
      await this.citasMedicasRepositorio.verificarTraslapePaciente(
        nuevosDatos.tipoDocPaciente,
        nuevosDatos.numeroDocPaciente,
        nuevosDatos.fecha,
        nuevosDatos.horaInicio,
        idCita
      );

    if (traslapePaciente.hayTraslape) {
      throw crearErrorDeDominio(
        CodigosDeError.PACIENTE_CON_CITA_EN_MISMO_HORARIO
      );
    }

    // Validar traslape del médico (excluyendo la cita actual)
    const traslapeMedico =
      await this.citasMedicasRepositorio.verificarTraslapeMedico(
        nuevosDatos.medico,
        nuevosDatos.fecha,
        nuevosDatos.horaInicio,
        idCita
      );

    if (traslapeMedico.hayTraslape) {
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_DISPONIBLE);
    }

    // Crear objeto con los nuevos datos de la cita
    const nuevaCita: ICitaMedica = {
      medico: nuevosDatos.medico,
      tipoDocPaciente: nuevosDatos.tipoDocPaciente,
      numeroDocPaciente: nuevosDatos.numeroDocPaciente,
      fecha: nuevosDatos.fecha,
      horaInicio: nuevosDatos.horaInicio,
      estado: 1,
      idCitaAnterior: idCita,
    };

    // Reprogramar (marca la anterior como reprogramada y crea la nueva)
    return await this.citasMedicasRepositorio.reprogramarCita(
      idCita,
      nuevaCita
    );
  }
  async finalizarCita(idCita: string): Promise<ICitaMedica> {
    const cita = await this.citasMedicasRepositorio.obtenerCitaPorId(idCita);
    if (!cita) {
      throw new Error('La cita no existe en el sistema');
    }
    if (cita.estado === estadoCita.REPROGRAMADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_REPROGRAMADA);
    }
    if (cita?.estado === estadoCita.CANCELADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_CANCELADA);
    }
    if (cita?.estado === estadoCita.FINALIZADA) {
      throw crearErrorDeDominio(CodigosDeError.CITA_FINALIZADA);
    }
    return await this.citasMedicasRepositorio.finalizarCita(idCita);
  }
}
