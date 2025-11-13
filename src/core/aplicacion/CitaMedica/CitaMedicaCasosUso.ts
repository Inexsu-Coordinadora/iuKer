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

  async eliminarCita(idCita: string): Promise<void> {
    const validarExistencia = await this.obtenerCitaPorId(idCita);

    if (!validarExistencia) {
      throw new Error('No puede eliminar la cita con ese id porque no existe en el sistema');
    }

    await this.citasMedicasRepositorio.eliminarCita(idCita);
  }
}
