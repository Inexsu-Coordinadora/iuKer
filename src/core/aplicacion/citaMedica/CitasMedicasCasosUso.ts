import { ICitasMedicasRepositorio } from '../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { CitaMedicaRespuestaDTO } from '../../infraestructura/repositorios/postgres/dtos/CitaMedicaRespuestaDTO.js';
import { ICitasMedicasCasosUso } from './ICitasMedicasCasosUso.js';

export class CitasMedicasCasosUso implements ICitasMedicasCasosUso {
  constructor(private citasMedicasRepositorio: ICitasMedicasRepositorio) {}

  async obtenerCitas(limite?: number): Promise<CitaMedicaRespuestaDTO[]> {
    return await this.citasMedicasRepositorio.obtenerCitas(limite);
  }

  async obtenerCitaPorId(idCita: string): Promise<CitaMedicaRespuestaDTO | null> {
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
