import { IConsultorio } from "../../dominio/consultorio/IConsultorio.js";
import { IConsultoriosRepositorio } from "../../dominio/consultorio/IConsultoriosRepositorio.js";
import { ConsultorioRespuestaDTO } from "../../infraestructura/repositorios/postgres/dtos/consultorioRespuestaDTO.js";
import { IConsultorioCasosUso } from "./IConsultoriosCasosUso.js";

export class ConsultorioCasosUso implements IConsultorioCasosUso{
  constructor(private consultorioRepositorio: IConsultoriosRepositorio) {}

  async agregarConsultorio(datosConsultorio: IConsultorio): Promise<ConsultorioRespuestaDTO | null> {
    const idNuevoConsultorio = await this.consultorioRepositorio.agregarConsultorio(datosConsultorio);
    return idNuevoConsultorio;
  }

  async listarConsultorios(limite?: number): Promise<ConsultorioRespuestaDTO[]> {
    return await this.consultorioRepositorio.listarConsultorios(limite);
  }

  async obtenerConsultorioPorId(idConsultorio: string): Promise<ConsultorioRespuestaDTO | null> {
    const consultorioObtenido = await this.consultorioRepositorio.obtenerConsultorioPorId(idConsultorio);
    return consultorioObtenido;
  }

  async actualizarConsultorio(idConsultorio: string, datosConsultorio: IConsultorio): Promise<ConsultorioRespuestaDTO | null> {
    const consultorioActualizado = await this.consultorioRepositorio.actualizarConsultorio(idConsultorio, datosConsultorio);
    return consultorioActualizado || null;
  }

  async eliminarConsultorio(idConsultorio: string): Promise<void> {
    await this.consultorioRepositorio.eliminarConsultorio(idConsultorio);
  }
}