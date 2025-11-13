import { FastifyInstance } from 'fastify';
import { IRepositorioPacientes } from '../../dominio/Paciente/IRepositorioPacientes.js';
import { RepositorioPacientes } from '../postgres/PacientesRepositorio.js';
import { PacientesCasosUso } from '../../aplicacion/Paciente/PacientesCasosUso.js';
import { PacientesControlador } from '../controladores/PacientesControlador.js';
import { CitasRepositorio } from '../postgres/CitasRepositorio.js';
import { ConsultaPacienteCasosUso } from '../../aplicacion/servicios/consultaCitasPaciente/ConsultaCitasPacienteCasosUso.js';

function pacientesEnrutador(
  app: FastifyInstance,
  pacientesControlador: PacientesControlador
) {
  app.get('/pacientes', pacientesControlador.obtenerPacientes);
  app.get('/pacientes/:numeroDoc', pacientesControlador.obtenerPacientePorId);
  app.get('/pacientes/:numeroDoc/cita', pacientesControlador.obtenerCitasPorPaciente);
  app.post('/pacientes', pacientesControlador.crearPaciente);
  app.put('/pacientes/:numeroDoc', pacientesControlador.actualizarPaciente);
  app.delete('/pacientes/:numeroDoc', pacientesControlador.borrarPaciente);
}

export async function construirPacientesEnrutador(app: FastifyInstance) {
  const repositorioPacientes: IRepositorioPacientes = new RepositorioPacientes();
  const citasRepositorio = new CitasRepositorio();
  const pacientesCasosUso = new PacientesCasosUso(repositorioPacientes);
  const consultarCitasPacienteCasosUso = new ConsultaPacienteCasosUso(repositorioPacientes, citasRepositorio);

  const pacientesControlador = new PacientesControlador(pacientesCasosUso, consultarCitasPacienteCasosUso);
  pacientesEnrutador(app, pacientesControlador);
}
