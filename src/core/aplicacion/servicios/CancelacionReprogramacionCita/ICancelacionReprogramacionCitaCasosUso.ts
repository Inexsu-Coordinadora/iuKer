import { ICitaMedica } from '../../../dominio/CitaMedica/ICitaMedica.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';

export interface ICancelacionReprogramacionCitaCasosUso {
  cancelarCita(idCita: string): Promise<ICitaMedica>;
  reprogramarCita(idCita: string, nuevosDatos: citaMedicaDTO): Promise<ICitaMedica>;
  finalizarCita(idCita: string): Promise<ICitaMedica>;
}