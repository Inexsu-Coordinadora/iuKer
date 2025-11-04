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
    const citaAgendada = new CitaMedica(datosCitaMedica);
    return await this.citasMedicasRepositorio.agendarCita(citaAgendada);
  }

  async reprogramarCita(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null> {
    const citaReprogramada = await this.citasMedicasRepositorio.cambiarEstado(idCita, datosCitaMedica);

    return citaReprogramada || null;
  }

  async finalizarCita(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null> {
    const citaFinalizada = await this.citasMedicasRepositorio.cambiarEstado(idCita, datosCitaMedica);

    return citaFinalizada || null;
  }

  async cancelarCita(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null> {
    const citaCancelada = await this.citasMedicasRepositorio.cambiarEstado(idCita, datosCitaMedica);

    return citaCancelada || null;
  }

  async eliminarCita(idCita: string): Promise<void> {
    await this.citasMedicasRepositorio.eliminarCita(idCita);
  }
}
