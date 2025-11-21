import { ICitaMedica } from '../../dominio/citaMedica/ICitaMedica.js';
import { ICitasMedicasRepositorio } from '../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { CitaMedicaResumenDTO } from '../../infraestructura/repositorios/postgres/dtos/citaMedicaResumenDTO.js';
import { ICitasMedicasCasosUso } from './ICitasMedicasCasosUso.js';

export class CitasMedicasCasosUso implements ICitasMedicasCasosUso {
  constructor(private citasMedicasRepositorio: ICitasMedicasRepositorio) {}

  async obtenerCitas(limite?: number): Promise<CitaMedicaResumenDTO[]> {
    return await this.citasMedicasRepositorio.obtenerCitas(limite);
  }

  async obtenerCitaPorId(idCita: string): Promise<CitaMedicaResumenDTO | null> {
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
