import { FastifyInstance } from 'fastify';
import { CitasControlador } from '../controladores/CitasControlador.js';
import { CitasRepositorio } from '../postgres/CitasRepositorio.js';
import { CitaMedicaCasosUso } from '../../aplicacion/CitaMedica/CitaMedicaCasosUso.js';

function citasMedicasEnrutador(app: FastifyInstance, citasController: CitasControlador) {
  app.get('/citas-medicas', citasController.obtenerCitas);
  app.get('/citas-medicas/:idCita', citasController.obetenerCitaPorId);
  app.post('/citas-medicas', citasController.AgendarCita);
  app.post('/citas-medicas/:idCita/reprogramar', citasController.reprogramarCita);
  app.patch('/citas-medicas/:idCita/finalizar', citasController.finalizarCita);
  app.patch('/citas-medicas/:idCita/cancelar', citasController.cancelarCita);
}

export async function construirCitasEnrutados(app: FastifyInstance) {
  const citasRepositorio = new CitasRepositorio();
  const citasCasosUso = new CitaMedicaCasosUso(citasRepositorio);
  const citasController = new CitasControlador(citasCasosUso);

  citasMedicasEnrutador(app, citasController);
}
