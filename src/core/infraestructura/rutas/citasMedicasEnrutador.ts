import { FastifyInstance } from 'fastify';
import { CitasMedicasControlador } from '../controladores/CitasMedicasControlador.js';
import { CitasMedicasRepositorio } from '../postgres/CitasMedicasRepositorio.js';
import { CitasMedicasCasosUso } from '../../aplicacion/CitaMedica/CitasMedicasCasosUso.js';
import { CancelacionesReprogramacionesCitasCasosUso } from '../../aplicacion/servicios/CancelacionReprogramacionCita/CancelacionesReprogramacionesCitasCasosUso.js';
import { AgendamientoCitasCasosUso } from '../../aplicacion/servicios/agendamientoCitasMedicas/AgendamientoCitasCasosUso.js';
import { MedicosRepositorio } from '../postgres/MedicosRepositorio.js';
import { PacientesRepositorio } from '../postgres/PacientesRepositorio.js';

function citasMedicasEnrutador(app: FastifyInstance, citasMedicasController: CitasMedicasControlador) {
  app.get('/citas-medicas', citasMedicasController.obtenerCitas);
  app.get('/citas-medicas/:idCita', citasMedicasController.obtenerCitaPorId);
  app.post('/citas-medicas', citasMedicasController.agendarCita);
  app.put('/citas-medicas/reprogramacion/:idCita', citasMedicasController.reprogramarCita);
  app.put('/citas-medicas/finalizacion/:idCita', citasMedicasController.finalizarCita);
  app.put('/citas-medicas/cancelacion/:idCita', citasMedicasController.cancelarCita);
  app.delete('/citas-medicas/eliminacion/:idCita', citasMedicasController.eliminarCita);
}

export async function construirCitasEnrutados(app: FastifyInstance) {
  const citasMedicasRepositorio = new CitasMedicasRepositorio();
  const citasCasosUso = new CitasMedicasCasosUso(citasMedicasRepositorio);

  const medicoRepositorio = new MedicosRepositorio();
  const pacientesRepositorio = new PacientesRepositorio();
  const cancelacionReprogramacionCasosUso = new CancelacionesReprogramacionesCitasCasosUso(
    citasMedicasRepositorio,
    medicoRepositorio
  );

  const agendamientoCitaCasosUso = new AgendamientoCitasCasosUso(
    citasMedicasRepositorio,
    medicoRepositorio,
    pacientesRepositorio
  );

  const citasMedicasController = new CitasMedicasControlador(
    citasCasosUso,
    cancelacionReprogramacionCasosUso,
    agendamientoCitaCasosUso
  );
  citasMedicasEnrutador(app, citasMedicasController);
}
