import { FastifyReply, FastifyRequest } from 'fastify';
import { ICitaMedicaCasosUso } from '../../aplicacion/CitaMedica/ICitaMedicaCasosUso.js';
import { citaMedicaDTO, crearCitaMedicaEsquema } from '../esquemas/citaMedicaEsquema.js';
import { ZodError } from 'zod';
import { ICitaMedica } from '../../dominio/CitaMedica/ICitaMedica.js';
import { IAgendamientoCitaCasosUso } from '../../aplicacion/servicios/agendamientoCita/IAgendamientoCitaCasosUso.js';
import { ICancelacionReprogramacionCitaServicio } from
'../../aplicacion/servicios/CancelacionReprogramacionCita/ICancelacionReprogramacionCitaCasosUso.js';
import { EstadoHttp } from './estadoHttp.enum.js';

export class CitasControlador {
  constructor(
    private citasCasosUso: ICitaMedicaCasosUso,
    private agendamientoCitaCasosUso: IAgendamientoCitaCasosUso,
    private cancelacionReprogramacionServicio: ICancelacionReprogramacionCitaServicio
  ) {}

  obtenerCitas = async (
    req: FastifyRequest<{ Querystring: { limite?: number } }>,
    res: FastifyReply
  ) => {
    try {
      const { limite } = req.query;
      const citasEncontradas = await this.citasCasosUso.obtenerCitas(limite);
      return res.code(EstadoHttp.OK).send({
        cantidadCitas: citasEncontradas.length,
        citasEncontradas
      });
    } catch (err) {
      return res.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje: 'Error al obtener citas',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  obtenerCitaPorId = async (
    req: FastifyRequest<{ Params: { idCita: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      const citaEncontrada = await this.citasCasosUso.obtenerCitaPorId(idCita);

      if (!citaEncontrada) {
        return res.code(EstadoHttp.NO_ENCONTRADO).send({
          mensaje: 'Cita no encontrada',
          error: `No existe una cita con el ID '${idCita}'`,
        });
      }

      return res.code(EstadoHttp.OK).send({
        mensaje: 'Cita encontrada',
        citaEncontrada,
      });

    } catch (err) {
      return res.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje: 'Error al obtener la cita',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  agendarCita = async (
    req: FastifyRequest<{ Body: citaMedicaDTO }>,
    res: FastifyReply
  ) => {
    try {
      const datosCita = crearCitaMedicaEsquema.parse(req.body);
      const citaAgendada = await this.agendamientoCitaCasosUso.ejecutar(datosCita);

      return res.code(EstadoHttp.CREADO).send({
        mensaje: 'Cita agendada correctamente',
        citaAgendada,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.code(EstadoHttp.PETICION_INVALIDA).send({
          mensaje: 'Los datos proporcionados no son válidos',
          error: err.issues[0]?.message || 'Error desconocido',
        });
      }

      return res.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje: 'Error al agendar cita',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  finalizarCita = async (req: FastifyRequest<{ Params: { idCita: string }; Body: ICitaMedica }>, res: FastifyReply) => {
    try {
      const { idCita } = req.params;
      const datosCita = req.body;
      const citafinalizada = await this.cancelacionReprogramacionServicio.finalizarCita(idCita);

      if (!citafinalizada) {
        return res.code(EstadoHttp.NO_ENCONTRADO).send({
          mensaje: 'La cita no se encontró en el sistema',
        });
      }
      return res.code(EstadoHttp.OK).send({
        mensaje: 'Cita finalizada correctamente',
        citafinalizada,
      });
    } catch (err) {
      return res.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje: 'Error al finalizar la cita',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  eliminarCita = async (
    req: FastifyRequest<{ Params: { idCita: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      await this.citasCasosUso.eliminarCita(idCita);

      return res.code(EstadoHttp.OK).send({
        mensaje: 'Cita eliminada correctamente',
        idCita,
      });
    } catch (err) {
      return res.code(EstadoHttp.PETICION_INVALIDA).send({
        error: 'Error al eliminar cita',
        mensaje: err instanceof Error ? err.message : String(err),
      });
    }
  };

  reprogramarCita = async (
    req: FastifyRequest<{ Params: { idCita: string }; Body: citaMedicaDTO }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      const nuevosDatos = crearCitaMedicaEsquema.parse(req.body);

      const citaReprogramada = await this.cancelacionReprogramacionServicio.reprogramarCita(
        idCita,
        nuevosDatos
      );

      return res.code(EstadoHttp.OK).send({
        mensaje: 'Cita reprogramada correctamente',
        citaReprogramada,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.code(EstadoHttp.PETICION_INVALIDA).send({
          mensaje: 'Los datos proporcionados no son válidos',
          error: err instanceof Error ? err.message : String(err),
        });
      }

      return res.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
        mensaje: 'Error al reprogramar cita',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  cancelarCita = async (
    req: FastifyRequest<{ Params: { idCita: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      const citaCancelada = await this.cancelacionReprogramacionServicio.cancelarCita(idCita);

      return res.code(EstadoHttp.OK).send({
        mensaje: 'Cita cancelada correctamente',
        citaCancelada,
      });
    } catch (err) {
      return res.code(EstadoHttp.PETICION_INVALIDA).send({
        mensaje: 'Error al cancelar cita',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };
}
