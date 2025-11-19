import { IConsultorio } from "../../dominio/Consultorio/IConsultorio.js";

export interface IConsultorioCasosUso {
  agregarConsultorio(consultorio: IConsultorio): Promise<string>;
  listarConsultorios(limite?: number): Promise<IConsultorio[]>;
  obtenerConsultorioPorId(idConsultorio: string): Promise<IConsultorio | null>;
  actualizarConsultorio(idConsultorio: string, consultorio: IConsultorio): Promise<IConsultorio | null>;
  eliminarConsultorio(idConsultorio: string): Promise<void>;
}