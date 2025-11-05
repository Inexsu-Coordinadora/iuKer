import { FastifyRequest, FastifyReply } from "fastify";
import { IConsultorio } from "../../dominio/Consultorio/IConsultorio.js"
import { IConsultorioCasosUso } from "../../aplicacion/Consultorio/IConsultorioCasosUso.js";
import { ConsultorioDTO, CrearConsultorioEsquema } from "../esquemas/consultorioEsquema.js"
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

      return reply.code(200).send({
        mensaje:"Consultorios encontrados de forma exitosa",
        consultorios: consultoriosEncontrados,
        consultoriosEncontrados: consultoriosEncontrados.length
      });
    } catch (error){
      return reply.code(404).send({
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
        return reply.code(404).send({
          mensaje:"Consultorio no encontrado"
        });
      }
      return reply.code(200).send({
        mensaje:"Consultorio encontrado correctamente",
        consultorio:consultorioEncontrado,
      });
    } catch (error){
      return reply.code(500).send({
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
        return reply.code(409).send({
          mensaje:"Ya existe un consultorio con ese ID",
          idConsultorio: nuevoConsultorioDTO.idConsultorio
        });
      }
      if (nuevoConsultorioDTO.estado !== 6 && nuevoConsultorioDTO.estado !== 7){
        return reply.code(400).send({
          mensaje:"El estado debe ser 6 o 7"
        });
      }
      const nuevoConsultorio: IConsultorio = {
        idConsultorio: nuevoConsultorioDTO.idConsultorio,
        ubicacion: nuevoConsultorioDTO.ubicacion,
        estado: nuevoConsultorioDTO.estado
      }

      const idNuevoConsultorio = await this.consultorioCasosUso.agregarConsultorio(nuevoConsultorio);

      return reply.code(201).send({
        mensaje: "El consultorio se agrego correctamente",
        idNuevoConsultorio: idNuevoConsultorio,
      });
    } catch (error) {
      if (error instanceof ZodError){
        return reply.code(400).send({
          mensaje:"Error al agregar nuevo consultorio",
          error: error.issues[0]?.message || "Error desconocido",
        });
      }
      return reply.code(500).send({
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
      const nuevoConsultorio = request.body;
      if(nuevoConsultorio.estado !== 6 && nuevoConsultorio.estado !== 7){
          return reply.code(400).send({
          mensaje:"El estado debe ser 6 o 7"
        });
      }

      const consultorioActualizado = await this.consultorioCasosUso.
        actualizarConsultorio(idConsultorio, nuevoConsultorio);

      if(!consultorioActualizado){
        return reply.code(404).send({
          mensaje:"Consultorio no encontrado"
        })
      }
      return reply.code(202).send({
        mensaje:"Consultorio actualizado correctamente",
        consultorioActualizado: consultorioActualizado
      })
    } catch (error){
      return reply.code(500).send({
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
        return reply.code(400).send({
          mensaje:"El ID del consultorio es obligatorio y no puede estar vacio"
        });
      }
      // ? BUSCAR PARSEO PARA EVITAR INGRESAR LETRAS EN VEZ DE IDS (NUMEROS) EN FORMATO STRING
      const consultorio = await this.consultorioCasosUso.obtenerConsultorioPorId(idConsultorio);
      // Valida que el consultorio exista
      if (!consultorio){
        return reply.code(404).send({
          mensaje:"No existe un consultorio con ese ID",
          idConsultorio: idConsultorio
        })
      }
      await this.consultorioCasosUso.eliminarConsultorio(idConsultorio);

      return reply.code(200).send({
        mensaje:"Consultorio eliminado correctamente",
        idConsultorio: idConsultorio
      });
    } catch (error){
      return reply.code(500).send({
        mensaje:"Error al eliminar el consultorio",
        error: error instanceof Error ? error.message:error
      });
    }
  };
}