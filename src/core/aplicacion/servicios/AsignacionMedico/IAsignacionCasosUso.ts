import { IAsignacionMedico } from '../../../dominio/AsignacionMedico/IAsignacionMedico.js';

export interface IAsignacionCasosUso {
  crearAsignacion(nuevaAsignacion: IAsignacionMedico): Promise<string>;

  eliminarAsignacion(tarjetaProfesionalMedico: string): Promise<void>;
}
