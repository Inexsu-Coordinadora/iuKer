import { FastifyInstance } from 'fastify';
import { IAsignacionMedicoRepositorio } from '../../dominio/AsignacionMedico/IAsignacionMedicoRepositorio.js';
import { AsignacionControlador } from '../controladores/AsignacionControlador.js';
import { AsignacionMedicoRepositorio } from '../postgres/AsignacionMedicoRepositorio.js';
import { AsignacionCasosUso } from '../../aplicacion/servicios/AsignacionMedico/AsignacionCasosUso.js';
import { IMedicosRepositorio } from '../../dominio/Medico/IMedicosRepositorio.js';
import { IRepositorioConsultorio } from '../../dominio/Consultorio/IRepositorioConsultorio.js';
import { MedicosRepositorio } from '../../infraestructura/postgres/MedicosRepositorio.js';
import { ConsultorioRepositorio } from '../../infraestructura/postgres/ConsultorioRepositorio.js';

function asignacionEnrutador(
  app: FastifyInstance,
  asignacionControlador: AsignacionControlador
) {
  app.post('/asignaciones', asignacionControlador.crearAsignacion);
  app.delete(
    '/asignaciones/:tarjetaProfesionalMedico',
    asignacionControlador.eliminarAsignación
  );
}

export async function construirAsignacionEnrutador(app: FastifyInstance) {
  const asignacionRepositorio: IAsignacionMedicoRepositorio =
    new AsignacionMedicoRepositorio();
  const medicoRepositorio: IMedicosRepositorio = new MedicosRepositorio();
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
