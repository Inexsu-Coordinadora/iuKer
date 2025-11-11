import { FastifyInstance } from 'fastify';
import { IRepositorioAsignacion } from '../../dominio/IRepositorioAsignacion.js';
import { AsignacionControlador } from '../controlador/AsignacionControlador.js';
import { AsignacionRepositorio } from '../postgre/AsignacionRepositorio.js';
import { AsignacionCasosUso } from '../../aplicacion/AsignacionCasosUso.js';
import { IMedicoRepositorio } from '../../../../core/dominio/Medico/IMedicoRepositorio.js';
import { IRepositorioConsultorio } from '../../../../core/dominio/Consultorio/IRepositorioConsultorio.js';
import { MedicoRepositorio } from '../../../../core/infraestructura/postgres/MedicosRepositorio.js';
import { ConsultorioRepositorio } from '../../../../core/infraestructura/postgres/ConsultorioRepositorio.js';

function asignacionEnrutador(
  app: FastifyInstance,
  asignacionControlador: AsignacionControlador
) {
  app.post('/asignaciones', asignacionControlador.crearAsignacion);
}

export async function construirAsignacionEnrutador(app: FastifyInstance) {
  const asignacionRepositorio: IRepositorioAsignacion =
    new AsignacionRepositorio();
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
