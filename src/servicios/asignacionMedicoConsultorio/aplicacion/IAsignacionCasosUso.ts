import { IAsignacionMedicoConsultorio } from '../dominio/IAsignacionMedicoConsultorio.js';

export interface IAsignacionCasosUso {
  crearAsignacion(
    nuevaAsignacion: IAsignacionMedicoConsultorio
  ): Promise<string>;
}
