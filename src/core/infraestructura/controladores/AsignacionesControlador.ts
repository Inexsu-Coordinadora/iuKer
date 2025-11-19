import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { IAsignacionCasosUso } from '../../aplicacion/servicios/asignacionMedico/IAsignacionCasosUso.js';
import {
  asignacionEsquema,
  IAsignacionCreacionDTO,
} from '../esquemas/asignacioneEsquema.js';
import { EstadoHttp } from './estadoHttp.enum.js';

export class AsignacionesControlador {
  constructor(private asignacionCasosUso: IAsignacionCasosUso) {}

  crearAsignacion = async (
    request: FastifyRequest<{ Body: IAsignacionCreacionDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevaAsignacionValidada = asignacionEsquema.parse(request.body);
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
      // ***********
      // -> Verificar este error para que sea acorde a la convención de errores ( se repite en el condicional anterior)
      if (err instanceof Error) {
        return reply.code(EstadoHttp.PETICION_INVALIDA).send({
          mensaje: 'Fallo en las Condiciones de Uso',
          error: err.message,
        });
      }
      // ***********
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
