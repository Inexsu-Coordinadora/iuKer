import { FastifyInstance } from 'fastify';
import { CitasControlador } from '../controladores/CitasControlador.js';
import { CitasRepositorio } from '../postgres/CitasRepositorio.js';
import { CitaMedicaCasosUso } from '../../aplicacion/CitaMedica/CitaMedicaCasosUso.js';
import { CancelacionReprogramacionCitaServicio } from
'../../aplicacion/servicios/CancelacionReprogramacionCita/CancelacionReprogramacionCitaCasosUso.js';

function citasMedicasEnrutador(app: FastifyInstance, citasController: CitasControlador) {
  app.get('/citas-medicas', citasController.obtenerCitas);
  app.get('/citas-medicas/:idCita', citasController.obtenerCitaPorId);
  app.post('/citas-medicas', citasController.agendarCita);
  app.put('/citas-medicas/reprogramacion/:idCita', citasController.reprogramarCita);
  app.put('/citas-medicas/finalizacion/:idCita', citasController.finalizarCita);
  app.put('/citas-medicas/cancelacion/:idCita', citasController.cancelarCita);
  app.delete('/citas-medicas/eliminacion/:idCita', citasController.eliminarCita);
}

export async function construirCitasEnrutados(app: FastifyInstance) {
  const citasRepositorio = new CitasRepositorio();
  const citasCasosUso = new CitaMedicaCasosUso(citasRepositorio);
  const cancelacionReprogramacionServicio = new CancelacionReprogramacionCitaServicio(citasRepositorio);
  const citasController = new CitasControlador(citasCasosUso, cancelacionReprogramacionServicio);
  citasMedicasEnrutador(app, citasController);
}
