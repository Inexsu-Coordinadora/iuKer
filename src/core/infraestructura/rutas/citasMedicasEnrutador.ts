import { FastifyInstance } from 'fastify';
import { CitasControlador } from '../controladores/CitasControlador.js';
import { CitasRepositorio } from '../postgres/CitasRepositorio.js';
import { CitaMedicaCasosUso } from '../../aplicacion/CitaMedica/CitaMedicaCasosUso.js';
import { AgendamientoCitaCasosUso } from '../../aplicacion/servicios/agendamientoCita/AgendamientoCitaCasosUso.js';
import { MedicoRepositorio } from '../postgres/MedicosRepositorio.js';
import { RepositorioPacientes } from '../postgres/PacientesRepositorio.js';

function citasMedicasEnrutador(app: FastifyInstance, citasController: CitasControlador) {
  app.get('/citas-medicas', citasController.obtenerCitas);
  app.get('/citas-medicas/:idCita', citasController.obetenerCitaPorId);
  app.post('/citas-medicas', citasController.AgendarCita);
  app.put('/citas-medicas/reprogramacion/:idCita', citasController.reprogramarCita);
  app.put('/citas-medicas/finalizacion/:idCita', citasController.finalizarCita);
  app.put('/citas-medicas/cancelacion/:idCita', citasController.cancelarCita);
  app.delete('/citas-medicas/eliminacion/:idCita', citasController.eliminarCita);
}

export async function construirCitasEnrutados(app: FastifyInstance) {
  const citasRepositorio = new CitasRepositorio();
  const citasCasosUso = new CitaMedicaCasosUso(citasRepositorio);

  const medicoRepositorio = new MedicoRepositorio();
  const pacienteRepositorio = new RepositorioPacientes();

  const agendamientoCitaCasosUso = new AgendamientoCitaCasosUso(
    citasRepositorio,
    medicoRepositorio,
    pacienteRepositorio
  );
  const citasController = new CitasControlador(citasCasosUso, agendamientoCitaCasosUso);

  citasMedicasEnrutador(app, citasController);
}
