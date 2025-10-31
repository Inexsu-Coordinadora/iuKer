import { IConsultorio } from "./IConsultorio.js";
// import { Pool } from "pg";

export interface IRepositorioConsultorio {
  agregarConsultorios(datosConsultorio: IConsultorio): Promise<string>;
  listarConsultorio(limite?: number): Promise<IConsultorio[]>;
  obtenerConsultorioPorId(idConsultorio: string): Promise<IConsultorio | null>;
  actualizarConsultorio(idConsultorio: string, datosConsultorio: IConsultorio): Promise<IConsultorio | null>;
  eliminarConsultorio(idConsultorio: string): Promise<boolean>;
}