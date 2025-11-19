import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { IAsignacionCasosUso } from '../../aplicacion/servicios/AsignacionMedico/IAsignacionCasosUso.js';
import {
  AsignacionCreacionEsquema,
  IAsignacionCreacionDTO,
} from '../esquemas/asignacionesEsquema.js';
import { EstadoHttp } from './estadoHttp.enum.js';

export class AsignacionesControlador {
  constructor(private asignacionCasosUso: IAsignacionCasosUso) {}

  crearAsignacion = async (
    request: FastifyRequest<{ Body: IAsignacionCreacionDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevaAsignacionValidada = AsignacionCreacionEsquema.parse(
        request.body
      );
      const idNuevaAsignacion = await this.asignacionCasosUso.crearAsignacion(
        nuevaAsignacionValidada
      );

      return reply.code(EstadoHttp.CREADO).send({
        mensaje: 'Asignación creada exitosamente',
        idNuevaAsignacion: idNuevaAsignacion,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(EstadoHttp.PETICION_INVALIDA).send({
          mensaje:
            'Error al crear la asignación, hay alguna invalidez en los datos enviados.',
          error: err.issues[0]?.message || 'Error de validación desconocido.',
          detalles: err.issues.map((issue) => ({
            ruta: issue.path.join('.'),
            mensaje: issue.message,
          })),
        });
      }

      if (err instanceof Error) {
        return reply.code(EstadoHttp.CONFLICTO).send({
          mensaje: 'Fallo en las Condiciones de Uso',
          error: err.message,
        });
      }

      return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje: 'Error interno del servidor al crear la asignación',
        error: (err as any).message || 'Error desconocido.',
      });
    }
  };

  eliminarAsignación = async (
    request: FastifyRequest<{ Params: { tarjetaProfesionalMedico: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { tarjetaProfesionalMedico } = request.params;
      await this.asignacionCasosUso.eliminarAsignacion(
        tarjetaProfesionalMedico
      );

      return reply.code(EstadoHttp.OK).send({
        mensaje: `Eliminado el medico con id '${tarjetaProfesionalMedico}'`,
      });
    } catch (err) {
      return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje: 'Error interno del servidor al eliminar las asignaciónes',
        error: (err as any).message || 'Error desconocido.',
      });
    }
  };
}
