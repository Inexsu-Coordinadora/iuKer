import { ICitaMedica } from '../../../dominio/CitaMedica/ICitaMedica.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';

export interface IAgendamientoCitasCasosUso {
  ejecutar(datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica>;
}
