import { FastifyInstance } from 'fastify';
import { IAsignacionMedicoRepositorio } from '../../dominio/AsignacionMedico/IAsignacionMedicoRepositorio.js';
import { AsignacionControlador } from '../controladores/AsignacionControlador.js';
import { AsignacionMedicoRepositorio } from '../postgres/AsignacionMedicoRepositorio.js';
import { AsignacionCasosUso } from '../../aplicacion/servicios/AsignacionMedico/AsignacionCasosUso.js';
import { IMedicoRepositorio } from '../../dominio/Medico/IMedicoRepositorio.js';
import { IRepositorioConsultorio } from '../../dominio/Consultorio/IRepositorioConsultorio.js';
import { MedicoRepositorio } from '../../infraestructura/postgres/MedicosRepositorio.js';
import { ConsultorioRepositorio } from '../../infraestructura/postgres/ConsultorioRepositorio.js';

function asignacionEnrutador(
  app: FastifyInstance,
  asignacionControlador: AsignacionControlador
) {
  app.post('/asignaciones', asignacionControlador.crearAsignacion);
}

export async function construirAsignacionEnrutador(app: FastifyInstance) {
  const asignacionRepositorio: IAsignacionMedicoRepositorio =
    new AsignacionMedicoRepositorio();
  const medicoRepositorio: IMedicoRepositorio = new MedicoRepositorio();
  const consultorioRepositorio: IRepositorioConsultorio =
    new ConsultorioRepositorio();

  const asignacionCasosUso = new AsignacionCasosUso(
    asignacionRepositorio,
    medicoRepositorio,
    consultorioRepositorio
  );
  const asignacionControlador = new AsignacionControlador(asignacionCasosUso);

  asignacionEnrutador(app, asignacionControlador);
}
