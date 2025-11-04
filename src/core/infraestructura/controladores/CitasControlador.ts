import { FastifyReply, FastifyRequest } from 'fastify';
import { ICitaMedicaCasosUso } from '../../aplicacion/CitaMedica/ICitaMedicaCasosUso.js';
import { citaMedicaDTO, crearCitaMedicaEsquema } from '../esquemas/citaMedicaEsquema.js';
import { ZodError } from 'zod';

export class CitasControlador {
  constructor(private citasCasosUso: ICitaMedicaCasosUso) {}

  obtenerCitas = async (req: FastifyRequest<{ Querystring: { limite?: number } }>, res: FastifyReply) => {
    try {
      const { limite } = req.query;
      const citasEncontradas = await this.citasCasosUso.obtenerCitas(limite);

      return res.code(200).send({
        mensaje: 'Citas encontradas exitosamente',
        citasMedicas: citasEncontradas,
        totalCitasEncontradas: citasEncontradas.length,
      });
    } catch (err) {
      return res.code(500).send({
        mensaje: 'Error al consultar las citas médicas',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  obetenerCitaPorId = async (req: FastifyRequest<{ Params: { idCita: string } }>, res: FastifyReply) => {
    try {
      const { idCita } = req.params;
      const citaEncontrada = await this.citasCasosUso.obtenerCitaPorId(idCita);

      if (!citaEncontrada) {
        return res.code(404).send({
          mensaje: 'Cita no encontrada',
        });
      }

      return res.code(200).send({
        mensaje: 'Cita encontrada con éxito',
        citaEncontrada,
      });
    } catch (err) {
      return res.code(500).send({
        mensaje: 'Error al consultar la cita médica',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  AgendarCita = async (req: FastifyRequest<{ Body: citaMedicaDTO }>, res: FastifyReply) => {
    try {
      const datosCita = crearCitaMedicaEsquema.parse(req.body);
      const citaAgendada = await this.citasCasosUso.agendarCita(datosCita);

      return res.code(201).send({
        mensaje: 'Cita agendada con éxito',
        citaAgendada,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.code(400).send({
          mensaje: 'Información inválida para agendar la cita',
          error: err.issues[0]?.message || 'Error desconocido',
        });
      }

      return res.code(500).send({
        mensaje: 'Error al intentar crear la cita',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  reprogramarCita = async (
    req: FastifyRequest<{ Params: { idCita: string }; Body: citaMedicaDTO }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      const nuevaInfoCita = req.body;
      const citaReprogramada = await this.citasCasosUso.reprogramarCita(idCita, nuevaInfoCita);

      if (!citaReprogramada) {
        return res.code(404).send({
          mensaje: 'La cita no se pudo reprogramar porque no se econtró en el sistema de citas',
        });
      }

      return res.code(200).send({
        mensaje: 'Cita actualizada correctamente',
        citaReprogramada,
      });
    } catch (err) {
      return res.code(500).send({
        mensaje: 'Error al reprogramar la cita',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  finalizarCita = async (
    req: FastifyRequest<{ Params: { idCita: string }; Body: citaMedicaDTO }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      const infoCitaFinalizada = req.body;
      const citafinalizada = await this.citasCasosUso.finalizarCita(idCita, infoCitaFinalizada);

      if (!citafinalizada) {
        return res.code(404).send({
          mensaje: 'La cita no pudo ser finalizada porque no se encontró en sistema de citas ',
        });
      }

      return res.code(200).send({
        mensaje: 'Cita finalizada correctamente',
        citafinalizada,
      });
    } catch (err) {
      return res.code(500).send({
        mensaje: 'Error al finalizar la cita',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  cancelarCita = async (
    req: FastifyRequest<{ Params: { idCita: string }; Body: citaMedicaDTO }>,
    res: FastifyReply
  ) => {
    try {
      const { idCita } = req.params;
      const infoCitaCancelada = req.body;
      const citaCancelada = await this.citasCasosUso.cancelarCita(idCita, infoCitaCancelada);

      if (!citaCancelada) {
        return res.code(404).send({
          mensaje: 'La cita no pudo ser cancelada porque no se encontró en sistema de citas ',
        });
      }

      return res.code(200).send({
        mensaje: 'Cita cancelada correctamente',
        citaCancelada,
      });
    } catch (err) {
      return res.code(500).send({
        mensaje: 'Error al cancelar la cita',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };
}
