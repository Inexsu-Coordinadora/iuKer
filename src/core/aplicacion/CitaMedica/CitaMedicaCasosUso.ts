import { CitaMedica } from '../../dominio/CitaMedica/CitaMedica.js';
import { ICitaMedica } from '../../dominio/CitaMedica/ICitaMedica.js';
import { IRepositorioCitaMedica } from '../../dominio/CitaMedica/IRepositorioCitaMedica.js';
import { citaMedicaDTO } from '../../infraestructura/esquemas/citaMedicaEsquema.js';
import { ICitaMedicaCasosUso } from './ICitaMedicaCasosUso.js';

export class CitaMedicaCasosUso implements ICitaMedicaCasosUso {
  constructor(private citasMedicasRepositorio: IRepositorioCitaMedica) {}

  async obtenerCitas(limite?: number): Promise<ICitaMedica[]> {
    return await this.citasMedicasRepositorio.obtenerCitas(limite);
  }

  async obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null> {
    return await this.citasMedicasRepositorio.obtenerCitaPorId(idCita);
  }

  async agendarCita(datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica> {
    // Validar disponibilidad del médico
    const disponible = await this.citasMedicasRepositorio.validarTurnoMedico(datosCitaMedica
    );

    if (!disponible) {
      throw new Error('El médico no tiene un turno asignado para el día y horario solicitado');
    }
    // Validar traslapes
    const traslapePaciente = await this.citasMedicasRepositorio.verificarTraslapePaciente(
      datosCitaMedica.tipoDocPaciente,
      datosCitaMedica.numeroDocPaciente,
      datosCitaMedica.fecha,
      datosCitaMedica.horaInicio
    );

    if (traslapePaciente.hayTraslape) {
      throw new Error('El paciente ya tiene una cita programada que se traslapa con el horario solicitado');
    }

    const traslapeMedico = await this.citasMedicasRepositorio.verificarTraslapeMedico(
      datosCitaMedica.medico,
      datosCitaMedica.fecha,
      datosCitaMedica.horaInicio
    );

    if (traslapeMedico.hayTraslape) {
      throw new Error('El médico ya tiene una cita programada que se traslapa con el horario solicitado');
    }

    const citaAgendada = new CitaMedica(datosCitaMedica);
    return await this.citasMedicasRepositorio.agendarCita(citaAgendada);
  }

  async eliminarCita(idCita: string): Promise<void> {
    const validarExistencia = await this.obtenerCitaPorId(idCita);

    if (!validarExistencia) {
      throw new Error('No puede eliminar la cita con ese id porque no existe en el sistema');
    }

    await this.citasMedicasRepositorio.eliminarCita(idCita);
  }
}
