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
    const citaAgendada = new CitaMedica(datosCitaMedica);
    return await this.citasMedicasRepositorio.agendarCita(citaAgendada);
  }

  async reprogramarCita(idCita: string, datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica | null> {
    const citaAReprogramar = await this.obtenerCitaPorId(idCita);

    if (!citaAReprogramar) return null;

    const citaReprogramadaHistorial = new CitaMedica(citaAReprogramar);
    citaReprogramadaHistorial.actualizarEstado(3, 'reprogramar');

    await this.citasMedicasRepositorio.cambiarEstado(idCita, citaReprogramadaHistorial);

    const nuevaCitaReprogramada = new CitaMedica({
      ...datosCitaMedica,
      idCitaAnterior: citaAReprogramar.idCita ?? null,
    });

    return await this.citasMedicasRepositorio.agendarCita(nuevaCitaReprogramada);
  }

  async finalizarCita(idCita: string): Promise<ICitaMedica | null> {
    const citasAFinalizar = await this.obtenerCitaPorId(idCita);

    if (!citasAFinalizar) return null;

    const citaFinalizada = new CitaMedica(citasAFinalizar);
    citaFinalizada.actualizarEstado(4, 'finalizar');

    return await this.citasMedicasRepositorio.cambiarEstado(idCita, citaFinalizada);
  }

  async cancelarCita(idCita: string): Promise<ICitaMedica | null> {
    const citaACancelar = await this.obtenerCitaPorId(idCita);

    if (!citaACancelar) return null;

    const citaCancelada = new CitaMedica(citaACancelar);
    citaCancelada.actualizarEstado(5, 'cancelar');

    return await this.citasMedicasRepositorio.cambiarEstado(idCita, citaCancelada);
  }
}
