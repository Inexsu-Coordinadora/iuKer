import { ICitaMedica } from '../../dominio/citaMedica/ICitaMedica.js';
import { ICitasMedicasRepositorio } from '../../dominio/citaMedica/ICitasMedicasRepositorio.js';
import { ICitasMedicasCasosUso } from './ICitasMedicasCasosUso.js';
import { crearErrorDeDominio } from '../../dominio/errores/manejoDeErrores.js';
import { CodigosDeError } from '../../dominio/errores/codigosDeError.enum.js';

export class CitasMedicasCasosUso implements ICitasMedicasCasosUso {
  constructor(private citasMedicasRepositorio: ICitasMedicasRepositorio) {}

  async obtenerCitas(limite?: number): Promise<ICitaMedica[]> {
    return await this.citasMedicasRepositorio.obtenerCitas(limite);
  }

  async obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null> {
    return await this.citasMedicasRepositorio.obtenerCitaPorId(idCita);
  }

  async eliminarCita(idCita: string): Promise<void> {
    const validarExistencia = await this.obtenerCitaPorId(idCita);

    if (!validarExistencia) {
      throw crearErrorDeDominio(CodigosDeError.CITA_NO_EXISTE);
    }

    await this.citasMedicasRepositorio.eliminarCita(idCita);
  }
}
