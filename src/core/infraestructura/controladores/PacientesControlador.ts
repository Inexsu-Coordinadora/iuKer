import { IPacientesCasosUso } from '../../aplicacion/Paciente/IPacientesCasosUso.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  PacienteDTO,
  CrearPacienteEsquema,
} from '../esquemas/esquemaPacientes.js';
import { ZodError } from 'zod';
import { IPaciente } from '../../dominio/Paciente/IPaciente.js';

export class PacientesControlador {
  constructor(private pacientesCasosUso: IPacientesCasosUso) {}

  obtenerPacientes = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const pacientesObtenidos = await this.pacientesCasosUso.obtenerPacientes(
        limite
      );

      return reply.code(200).send({
        mensaje: 'Estos son los pacientes obtenidos',
        pacientes: pacientesObtenidos,
        cantidadPacientesObtenidos: pacientesObtenidos.length,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: 'No se pudieron obtener los Pacientes',
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  obtenerPacientePorId = async (
    request: FastifyRequest<{ Params: { idPaciente: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idPaciente } = request.params;
      const pacienteObtenido =
        await this.pacientesCasosUso.obtenerPacientePorId(idPaciente);

      if (!pacienteObtenido) {
        return reply.code(404).send({
          mensaje: 'Paciente no encontrado',
        });
      }

      return reply.code(200).send({
        mensaje: 'Pciente encontrado',
        paciente: pacienteObtenido,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: 'Error al intentar obtener los datos del paciente',
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  crearPaciente = async (
    request: FastifyRequest<{ Body: PacienteDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevoPaciente = CrearPacienteEsquema.parse(request.body);
      const idNuevoPaciente =
        this.pacientesCasosUso.crearPaciente(nuevoPaciente);

      return reply.code(200).send({
        mensaje: 'El paciente se creó correctamente',
        idNuevoPaciente: idNuevoPaciente,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: 'Error crear al Paciente',
          error: err.issues[0]?.message || 'Error desconocido',
        });
      }

      return reply.code(500).send({
        mensaje: 'Error al crear un paciente',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  actualizarPaciente = async (
    request: FastifyRequest<{
      Params: { idPaciente: string };
      Body: IPaciente;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { idPaciente } = request.params;
      const nuevoPaciente = request.body;

      const pacienteActualizado =
        await this.pacientesCasosUso.actualizarPaciente(
          idPaciente,
          nuevoPaciente
        );

      if (!pacienteActualizado) {
        return reply.code(404).send({
          mensaje: 'Paciente no encontrado',
        });
      }

      return reply.code(200).send({
        mensaje: 'Paciente actualizado satisfactoriamente',
        pacienteActualizado: pacienteActualizado,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: 'Error al actualizar a el paciente',
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  borrarPaciente = async (
    request: FastifyRequest<{ Params: { idPaciente: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idPaciente } = request.params;
      await this.pacientesCasosUso.borrarPaciente(idPaciente);

      return reply.code(200).send({
        mensaje: 'Paciente borrado correctamente del sistema',
        idPaciente: idPaciente,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: 'Error al borrar a el paciente del sistema',
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}
