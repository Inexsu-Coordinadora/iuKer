import { ICitaMedica } from '../../../dominio/CitaMedica/ICitaMedica.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';

export interface IAgendamientoCitaCasosUso {
  ejecutar(datosCitaMedica: citaMedicaDTO): Promise<ICitaMedica>;
}
