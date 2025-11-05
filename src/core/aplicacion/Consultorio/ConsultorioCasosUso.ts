import { IConsultorio } from "../../dominio/Consultorio/IConsultorio.js";
import { IRepositorioConsultorio } from "../../dominio/Consultorio/IRepositorioConsultorio.js";

export class ConsultorioCasosUso {
  constructor(private consultorioRepositorio: IRepositorioConsultorio) {}

  async agregarConsultorio(datosConsultorio: IConsultorio): Promise<string> {
    const idNuevoConsultorio = await this.consultorioRepositorio.agregarConsultorio(datosConsultorio);
    return idNuevoConsultorio;
  }

  async listarConsultorios(limite?: number): Promise<IConsultorio[]> {
    return await this.consultorioRepositorio.listarConsultorios(limite);
  }

  async obtenerConsultorioPorId(idConsultorio: string): Promise<IConsultorio | null> {
    const consultorioObtenido = await this.consultorioRepositorio.obtenerConsultorioPorId(idConsultorio);
    console.log(consultorioObtenido);
    return consultorioObtenido;
  }

  async actualizarConsultorio(idConsultorio: string, consultorio: IConsultorio): Promise<IConsultorio | null> {
    const consultorioActualizado = await this.consultorioRepositorio.actualizarConsultorio(idConsultorio, consultorio);
    return consultorioActualizado || null;
  }

  async eliminarConsultorio(idConsultorio: string): Promise<void> {
    await this.consultorioRepositorio.eliminarConsultorio(idConsultorio);
  }
}