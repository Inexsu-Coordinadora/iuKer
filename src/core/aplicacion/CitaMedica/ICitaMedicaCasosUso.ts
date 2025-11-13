import { ICitaMedica } from '../../dominio/CitaMedica/ICitaMedica.js';
import { citaMedicaDTO } from '../../infraestructura/esquemas/citaMedicaEsquema.js';

export interface ICitaMedicaCasosUso {
  obtenerCitas(limite?: number): Promise<ICitaMedica[]>;
  obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
  agendarCita(datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica>;
  // finalizarCita(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null>;
  eliminarCita(idCita: string): Promise<void>;
}
