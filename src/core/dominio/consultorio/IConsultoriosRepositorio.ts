import { IConsultorio } from './IConsultorio.js';

export interface IConsultoriosRepositorio {
  agregarConsultorio(datosConsultorio: IConsultorio): Promise<string>;
  listarConsultorios(limite?: number): Promise<IConsultorio[]>;
  obtenerConsultorioPorId(idConsultorio: string): Promise<IConsultorio | null>;
  actualizarConsultorio(idConsultorio: string, datosConsultorio: IConsultorio): Promise<IConsultorio | null>;
  eliminarConsultorio(idConsultorio: string): Promise<void>;
}