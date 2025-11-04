import { ICitaMedica } from '../../dominio/CitaMedica/ICitaMedica.js';
import { citaMedicaDTO } from '../../infraestructura/esquemas/citaMedicaEsquema.js';

export interface ICitaMedicaCasosUso {
  obtenerCitas(limite?: number): Promise<ICitaMedica[]>;
  obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
  agendarCita(datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica>;
  reprogramarCita(idCita: string, datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica | null>;
  finalizarCita(idCita: string, datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica | null>;
  cancelarCita(idCita: string, datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica | null>;
}
