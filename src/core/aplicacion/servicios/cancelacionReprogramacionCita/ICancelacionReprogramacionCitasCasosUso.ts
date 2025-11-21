import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { CitaMedicaResumenDTO } from '../../../infraestructura/repositorios/postgres/dtos/citaMedicaResumenDTO.js';

export interface ICancelacionReprogramacionCitasCasosUso {
  cancelarCita(idCita: string): Promise<CitaMedicaResumenDTO | null>;
  reprogramarCita(idCita: string, nuevosDatos: citaMedicaDTO): Promise<CitaMedicaResumenDTO | null>;
  finalizarCita(idCita: string): Promise<CitaMedicaResumenDTO | null>;
}
