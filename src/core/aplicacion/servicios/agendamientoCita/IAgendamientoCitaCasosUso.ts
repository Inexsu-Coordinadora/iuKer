import { ICitaMedica } from '../../../dominio/CitaMedica/ICitaMedica.js';

export interface IAgendamientoCitaCasosUso {
  ejecutar(
    tipoDocPaciente: number,
    numeroDocPaciente: string,
    medico: string,
    fecha: Date,
    horaInicio: string,
    idConsultorio: string
  ): Promise<ICitaMedica>;
}
