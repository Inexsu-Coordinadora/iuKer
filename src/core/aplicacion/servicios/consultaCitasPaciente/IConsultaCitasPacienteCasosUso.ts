import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';

export interface IConsultaCitasPacienteCasosUso {
    ejecutarServicio(numeroDocPaciente : string, limite? : number) : Promise <citaMedicaDTO[]>;
}

