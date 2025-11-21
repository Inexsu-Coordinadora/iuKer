import { IConsultorio } from "../../dominio/consultorio/IConsultorio.js";
import { IConsultoriosRepositorio } from "../../dominio/consultorio/IConsultoriosRepositorio.js";

export class ConsultorioCasosUso {
  constructor(private consultorioRepositorio: IConsultoriosRepositorio) {}

  async agregarConsultorio(datosConsultorio: IConsultorio): Promise<string> {
    const idNuevoConsultorio = await this.consultorioRepositorio.agregarConsultorio(datosConsultorio);
    return idNuevoConsultorio;
  }

  async listarConsultorios(limite?: number): Promise<IConsultorio[]> {
    return await this.consultorioRepositorio.listarConsultorios(limite);
  }

  async obtenerConsultorioPorId(idConsultorio: string): Promise<IConsultorio | null> {
    const consultorioObtenido = await this.consultorioRepositorio.obtenerConsultorioPorId(idConsultorio);
    return consultorioObtenido;
  }

  async actualizarConsultorio(idConsultorio: string, datosConsultorio: IConsultorio): Promise<IConsultorio | null> {
    const consultorioActualizado = await this.consultorioRepositorio.actualizarConsultorio(idConsultorio, datosConsultorio);
    return consultorioActualizado || null;
  }

  async eliminarConsultorio(idConsultorio: string): Promise<void> {
    await this.consultorioRepositorio.eliminarConsultorio(idConsultorio);
  }
}