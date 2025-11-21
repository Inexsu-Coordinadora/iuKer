import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { CitaMedicaResumenDTO } from '../../../infraestructura/repositorios/postgres/dtos/citaMedicaResumenDTO.js';

export interface IAgendamientoCitasCasosUso {
  ejecutar(datosCitaMedica: citaMedicaDTO): Promise<CitaMedicaResumenDTO | null>;
}
