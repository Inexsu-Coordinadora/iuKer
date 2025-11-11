import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { IAsignacionCasosUso } from '../../aplicacion/IAsignacionCasosUso.js';
import {
  AsignacionCreacionEsquema,
  IAsignacionCreacionDTO,
} from '../esquemas/asignacionesEsquema.js';

export class AsignacionControlador {
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

      return reply.code(201).send({
        mensaje: 'Asignación creada exitosamente',
        idNuevaAsignacion: idNuevaAsignacion,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
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
        return reply.code(409).send({
          mensaje: 'Fallo en las Condiciones de Uso',
          error: err.message,
        });
      }

      return reply.code(500).send({
        mensaje: 'Error interno del servidor al crear la asignación',
        error: (err as any).message || 'Error desconocido.',
      });
    }
  };
}
