import { CitaMedica } from '../../dominio/CitaMedica/CitaMedica.js';
import { ICitaMedica } from '../../dominio/CitaMedica/ICitaMedica.js';
import { IRepositorioCitaMedica } from '../../dominio/CitaMedica/IRepositorioCitaMedica.js';
import { ICitaMedicaCasosUso } from './ICitaMedicaCasosUso.js';

export class CitaMedicaCasosUso implements ICitaMedicaCasosUso {
  constructor(private citasMedicasRepositorio: IRepositorioCitaMedica) {}

  async obtenerCitas(limite?: number): Promise<ICitaMedica[]> {
    return await this.citasMedicasRepositorio.obtenerCitas(limite);
  }

  async obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null> {
    return await this.citasMedicasRepositorio.obtenerCitaPorId(idCita);
  }

  async agendarCita(datosCitaMedica: ICitaMedica): Promise<ICitaMedica> {
    const validarExistencia = await this.obtenerCitaPorId(datosCitaMedica.idCita);

    if (validarExistencia) throw new Error(`No puede crear la cita con ese id porque ya existe en el sistema`);

    const citaAgendada = new CitaMedica(datosCitaMedica);
    return await this.citasMedicasRepositorio.agendarCita(citaAgendada);
  }

  async reprogramarCita(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null> {
    const validarExistencia = await this.obtenerCitaPorId(idCita);

    if (!validarExistencia) throw new Error(`No puede reprogramar la cita con ese id porque no existe en el sistema`);

    const citaReprogramada = await this.citasMedicasRepositorio.cambiarEstado(idCita, datosCitaMedica);

    return citaReprogramada || null;
  }

  async finalizarCita(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null> {
    const validarExistencia = await this.obtenerCitaPorId(idCita);

    if (!validarExistencia) throw new Error(`No puede finalizar la cita con ese id porque no existe en el sistema`);

    const citaFinalizada = await this.citasMedicasRepositorio.cambiarEstado(idCita, datosCitaMedica);

    return citaFinalizada || null;
  }

  async cancelarCita(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null> {
    const validarExistencia = await this.obtenerCitaPorId(idCita);

    if (!validarExistencia) throw new Error(`No puede cancelar la cita con ese id porque no existe en el sistema`);

    const citaCancelada = await this.citasMedicasRepositorio.cambiarEstado(idCita, datosCitaMedica);

    return citaCancelada || null;
  }

  async eliminarCita(idCita: string): Promise<void> {
    const validarExistencia = await this.obtenerCitaPorId(idCita);

    if (!validarExistencia) throw new Error(`No puede eliminar la cita con ese id porque no existe en el sistema`);

    await this.citasMedicasRepositorio.eliminarCita(idCita);
  }
}
