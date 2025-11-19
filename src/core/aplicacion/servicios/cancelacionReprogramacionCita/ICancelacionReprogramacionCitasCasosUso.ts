import { ICitaMedica } from '../../../dominio/citaMedica/ICitaMedica.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';

export interface ICancelacionReprogramacionCitasCasosUso {
  cancelarCita(idCita: string): Promise<ICitaMedica>;
  reprogramarCita(idCita: string, nuevosDatos: citaMedicaDTO): Promise<ICitaMedica>;
  finalizarCita(idCita: string): Promise<ICitaMedica>;
}