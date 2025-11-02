import { FastifyInstance } from 'fastify';
import { IRepositorioPacientes } from '../../dominio/Paciente/IRepositorioPacientes.js';
import { RepositorioPacientes } from '../postgres/RepositorioPacientes.js';
import { PacientesCasosUso } from '../../aplicacion/Paciente/PacientesCasosUso.js';
import { PacientesControlador } from '../controladores/PacientesControlador.js';

function pacientesEnrutador(
  app: FastifyInstance,
  pacientesControlador: PacientesControlador
) {
  app.get('/pacientes', pacientesControlador.obtenerPacientes);
  app.get('/pacientes/:idPaciente', pacientesControlador.obtenerPacientePorId);
  app.post('/pacientes', pacientesControlador.crearPaciente);
  app.put('/pacientes/:idPaciente', pacientesControlador.actualizarPaciente);
  app.delete('/pacientes/:idPaciente', pacientesControlador.borrarPaciente);
}

export async function construirPacientesEnrutador(app: FastifyInstance) {
  const repositorioPacientes: IRepositorioPacientes =
    new RepositorioPacientes();
  const pacientesCasosUso = new PacientesCasosUso(repositorioPacientes);
  const pacientesControlador = new PacientesControlador(pacientesCasosUso);

  pacientesEnrutador(app, pacientesControlador);
}
