import { conversionAFechaColombia } from '../../../../common/conversionAFechaColombia.js';
import { CitaMedica } from '../../../dominio/citaMedica/CitaMedica.js';
import { ICitaMedica } from '../../../dominio/citaMedica/ICitaMedica.js';
import { ICitasMedicasRepositorio } from '../../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { CodigosDeError } from '../../../dominio/errores/codigosDeError.enum.js';
import { crearErrorDeDominio } from '../../../dominio/errores/manejoDeErrores.js';
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
    const paciente = await this.pacientesRepositorio.obtenerPacientePorId(
      idPaciente
    );

    if (!paciente) throw crearErrorDeDominio(CodigosDeError.PACIENTE_NO_EXISTE);
  }

  private async validarMedico(idMedico: string): Promise<void> {
    const medico =
      await this.medicosRepositorio.obtenerMedicoPorTarjetaProfesional(
        idMedico
      );

    if (!medico) throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_EXISTE);
  }

  private validarFechaVigente(datosCitaMedica: citaMedicaDTO): void {
    const fechaCita = conversionAFechaColombia(
      datosCitaMedica.fecha,
      datosCitaMedica.horaInicio
    );
    if (fechaCita < new Date())
      throw crearErrorDeDominio(CodigosDeError.AGENDADANDO_CITA_EN_EL_PASADO);
  }

  private async disponibilidadMedico(
    datosCitaMedica: citaMedicaDTO
  ): Promise<void> {
    const medicoDisponible =
      await this.citasMedicasRepositorio.validarDisponibilidadMedico(
        datosCitaMedica
      );

    if (medicoDisponible)
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_DISPONIBLE);
  }

  private async validarTurnoMedico(
    datosCitaMedica: citaMedicaDTO
  ): Promise<void> {
    const turnoExistente =
      await this.citasMedicasRepositorio.validarTurnoMedico(datosCitaMedica);

    if (!turnoExistente)
      throw crearErrorDeDominio(CodigosDeError.MEDICO_NO_DISPONIBLE);
  }

  private async validarCitasPaciente(
    datosCitaMedica: citaMedicaDTO
  ): Promise<void> {
    const validarCitas =
      await this.citasMedicasRepositorio.validarCitasPaciente(datosCitaMedica);

    if (validarCitas)
      throw crearErrorDeDominio(
        CodigosDeError.PACIENTE_CON_CITA_EN_MISMO_HORARIO
      );
  }
}
