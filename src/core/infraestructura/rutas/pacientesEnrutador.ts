import { FastifyInstance } from 'fastify';
import { IPacientesRepositorio } from '../../dominio/Paciente/IPacientesRepositorio.js';
import { RepositorioPacientes } from '../postgres/PacientesRepositorio.js';
import { PacientesCasosUso } from '../../aplicacion/Paciente/PacientesCasosUso.js';
import { PacientesControlador } from '../controladores/PacientesControlador.js';

function pacientesEnrutador(app: FastifyInstance, pacientesControlador: PacientesControlador) {
  app.get('/pacientes', pacientesControlador.obtenerPacientes);
  app.get('/pacientes/:numeroDoc', pacientesControlador.obtenerPacientePorId);
  app.post('/pacientes', pacientesControlador.crearPaciente);
  app.put('/pacientes/:numeroDoc', pacientesControlador.actualizarPaciente);
  app.delete('/pacientes/:numeroDoc', pacientesControlador.borrarPaciente);
}

export async function construirPacientesEnrutador(app: FastifyInstance) {
  const repositorioPacientes: IPacientesRepositorio = new RepositorioPacientes();
  const pacientesCasosUso = new PacientesCasosUso(repositorioPacientes);
  const pacientesControlador = new PacientesControlador(pacientesCasosUso);

  pacientesEnrutador(app, pacientesControlador);
}
