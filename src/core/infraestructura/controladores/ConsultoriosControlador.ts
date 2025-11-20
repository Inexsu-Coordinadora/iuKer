import { FastifyRequest, FastifyReply } from "fastify";
import { IConsultorio } from "../../dominio/consultorio/IConsultorio.js"
import { IConsultorioCasosUso } from "../../aplicacion/consultorio/IConsultoriosCasosUso.js";
import { ConsultorioDTO, CrearConsultorioEsquema } from "../esquemas/consultorioEsquema.js"
import { EstadoHttp } from "./estadoHttp.enum.js";
import { ZodError } from "zod";

export class ConsultoriosControlador{
  constructor(private consultorioCasosUso: IConsultorioCasosUso){}
  listarConsultorios = async(
    request: FastifyRequest<{ Querystring: { limite?:number} }>,
    reply: FastifyReply
  ) => {
    try {
      const {limite} = request.query;
      const consultoriosEncontrados = await this.consultorioCasosUso.listarConsultorios(limite);

      return reply.code(EstadoHttp.OK).send({
        mensaje:"Consultorios encontrados de forma exitosa",
        cantidadConsultoriosEncontrados: consultoriosEncontrados.length,
        consultoriosEncontrados
      });
    } catch (error){
      return reply.code(EstadoHttp.NO_ENCONTRADO).send({
        mensaje:"Error al obtener los consultorios",
        error: error instanceof Error ? error.message:error,
      })
    }
  };
  obtenerConsultorioPorId = async(
    request: FastifyRequest<{ Params: {idConsultorio:string} }>,
    reply: FastifyReply
  ) => {
    try {
      const {idConsultorio} = request.params;
      const consultorioEncontrado = await this.consultorioCasosUso.obtenerConsultorioPorId(idConsultorio);

      if (!consultorioEncontrado){
        return reply.code(EstadoHttp.NO_ENCONTRADO).send({
          mensaje:"Consultorio no encontrado"
        });
      }
      return reply.code(EstadoHttp.OK).send({
        mensaje:"Consultorio encontrado correctamente",
        consultorioEncontrado,
      });
    } catch (error){
      return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje:"Error al obtener consultorio",
        error: error instanceof Error ? error.message:error,
      });
    }
  };
  agregarConsultorio = async(
    request: FastifyRequest<{ Body:ConsultorioDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevoConsultorioDTO = CrearConsultorioEsquema.parse(request.body);
      const existeConsultorio = await this.consultorioCasosUso.obtenerConsultorioPorId(nuevoConsultorioDTO.idConsultorio);
      if(existeConsultorio){
        return reply.code(EstadoHttp.PETICION_INVALIDA).send({
          mensaje:"Ya existe un consultorio con ese ID",
          idConsultorio: nuevoConsultorioDTO.idConsultorio
        });
      }
      const nuevoConsultorio: IConsultorio = {
        idConsultorio: nuevoConsultorioDTO.idConsultorio,
        ubicacion: nuevoConsultorioDTO.ubicacion,
      }

      await this.consultorioCasosUso.agregarConsultorio(nuevoConsultorio);

      return reply.code(EstadoHttp.CREADO).send({
        mensaje: "El consultorio se agrego correctamente",
        nuevoConsultorio,
      });
    } catch (error) {
      if (error instanceof ZodError){
        return reply.code(EstadoHttp.PETICION_INVALIDA).send({
          mensaje:"Error al agregar nuevo consultorio",
          error: error.issues[0]?.message || "Error desconocido",
        });
      }
      return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje:"Error al agregar nuevo consultorio",
        error: error instanceof Error ? error.message:String(error),
      });
    }
  };
  actualizarConsultorio = async(
    request: FastifyRequest<{ Params: {idConsultorio: string}; Body:IConsultorio }>,
    reply: FastifyReply
  ) => {
    try {
      const { idConsultorio } = request.params;
      const datosNuevoConsultorio = request.body;

      const consultorioActualizado = await this.consultorioCasosUso.
        actualizarConsultorio(idConsultorio, datosNuevoConsultorio);

      if(!consultorioActualizado){
        return reply.code(EstadoHttp.NO_ENCONTRADO).send({
          mensaje:"Consultorio no encontrado"
        })
      }
      return reply.code(EstadoHttp.OK).send({
        mensaje:"Consultorio actualizado correctamente",
        consultorioActualizado
      })
    } catch (error){
      return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje:"Error al actualizar el consultorio",
        error: error instanceof Error ? error.message:error
      });
    }
  };
  eliminarConsultorio = async(
    request: FastifyRequest<{ Params: {idConsultorio:string} }>,
    reply: FastifyReply
  ) => {
    try {
      const {idConsultorio} = request.params;
      // Valida que el ID se ingrese
      if (!idConsultorio || idConsultorio.trim().length === 0){
        return reply.code(EstadoHttp.PETICION_INVALIDA).send({
          mensaje:"El ID del consultorio es obligatorio y no puede estar vacio"
        });
      }
      // ? BUSCAR PARSEO PARA EVITAR INGRESAR LETRAS EN VEZ DE IDS (NUMEROS) EN FORMATO STRING
      const consultorio = await this.consultorioCasosUso.obtenerConsultorioPorId(idConsultorio);
      // Valida que el consultorio exista
      if (!consultorio){
        return reply.code(EstadoHttp.NO_ENCONTRADO).send({
          mensaje:"No existe un consultorio con ese ID",
          idConsultorio
        })
      }
      await this.consultorioCasosUso.eliminarConsultorio(idConsultorio);

      return reply.code(EstadoHttp.OK).send({
        mensaje:"Consultorio eliminado correctamente",
        idConsultorio
      });
    } catch (error){
      return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje:"Error al eliminar el consultorio",
        error: error instanceof Error ? error.message:error
      });
    }
  };
}