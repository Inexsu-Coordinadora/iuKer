import { FastifyRequest, FastifyReply } from 'fastify';
import { IConsultorio } from '../../dominio/consultorio/IConsultorio.js';
import { IConsultorioCasosUso } from '../../aplicacion/consultorio/IConsultoriosCasosUso.js';
import {
  ConsultorioDTO,
  CrearConsultorioEsquema,
} from '../esquemas/consultorioEsquema.js';
import { EstadoHttp } from './estadoHttp.enum.js';
import { ZodError } from 'zod';

export class ConsultoriosControlador {
  constructor(private consultorioCasosUso: IConsultorioCasosUso) {}
  listarConsultorios = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const consultoriosEncontrados =
        await this.consultorioCasosUso.listarConsultorios(limite);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Consultorios encontrados de forma exitosa',
        consultorios: consultoriosEncontrados,
        consultoriosEncontrados: consultoriosEncontrados.length,
      });
    } catch (error) {
      throw error;
    }
  };

  obtenerConsultorioPorId = async (
    request: FastifyRequest<{ Params: { idConsultorio: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idConsultorio } = request.params;
      const consultorioEncontrado =
        await this.consultorioCasosUso.obtenerConsultorioPorId(idConsultorio);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Consultorio encontrado correctamente',
        consultorio: consultorioEncontrado,
      });
    } catch (error) {
      throw error;
    }
  };

  agregarConsultorio = async (
    request: FastifyRequest<{ Body: ConsultorioDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevoConsultorioDTO = CrearConsultorioEsquema.parse(request.body);

      const nuevoConsultorio: IConsultorio = {
        idConsultorio: nuevoConsultorioDTO.idConsultorio,
        ubicacion: nuevoConsultorioDTO.ubicacion,
      };

      const idNuevoConsultorio =
        await this.consultorioCasosUso.agregarConsultorio(nuevoConsultorio);

      return reply.code(EstadoHttp.CREADO).send({
        mensaje: 'El consultorio se agrego correctamente',
        idNuevoConsultorio: idNuevoConsultorio,
      });
    } catch (error) {
      throw error;
    }
  };

  actualizarConsultorio = async (
    request: FastifyRequest<{
      Params: { idConsultorio: string };
      Body: IConsultorio;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { idConsultorio } = request.params;
      const nuevoConsultorio = request.body;

      const consultorioActualizado =
        await this.consultorioCasosUso.actualizarConsultorio(
          idConsultorio,
          nuevoConsultorio
        );

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Consultorio actualizado correctamente',
        consultorioActualizado: consultorioActualizado,
      });
    } catch (error) {
      throw error;
    }
  };

  eliminarConsultorio = async (
    request: FastifyRequest<{ Params: { idConsultorio: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idConsultorio } = request.params;
      // Valida que el ID se ingrese
      if (!idConsultorio || idConsultorio.trim().length === 0) {
        return reply.code(EstadoHttp.PETICION_INVALIDA).send({
          mensaje:
            'El ID del consultorio es obligatorio y no puede estar vacio',
        });
      }
      // ? BUSCAR PARSEO PARA EVITAR INGRESAR LETRAS EN VEZ DE IDS (NUMEROS) EN FORMATO STRING
      const consultorio =
        await this.consultorioCasosUso.obtenerConsultorioPorId(idConsultorio);

      await this.consultorioCasosUso.eliminarConsultorio(idConsultorio);

      return reply.code(EstadoHttp.OK).send({
        mensaje: 'Consultorio eliminado correctamente',
        idConsultorio: idConsultorio,
      });
    } catch (error) {
      throw error;
    }
  };
}
