import Fastify from 'fastify';
import { FastifyError } from 'fastify';
import { configuracion } from '../../common/configuracion.js';
import { construirCitasEnrutados } from './rutas/citasMedicasEnrutador.js';
import { construirPacientesEnrutador } from './rutas/pacientesEnrutador.js';
import { construirMedicosEnrutador } from './rutas/medicosEnrutador.js';
import { construirConsultorioEnrutador } from './rutas/consultoriosEnrutador.js';
import { construirAsignacionesEnrutador } from '../infraestructura/rutas/asignacionesEnrutador.js';

const app = Fastify({ logger: true });

app.register(
  async (appInstance) => {
    construirConsultorioEnrutador(appInstance);
    construirCitasEnrutados(appInstance);
    construirMedicosEnrutador(appInstance);
    construirPacientesEnrutador(appInstance);
    //Servicios
    construirAsignacionesEnrutador(appInstance);
  },
  { prefix: '/api' }
);

export const startServer = async (): Promise<void> => {
  try {
    await app.listen({ port: configuracion.httpPuerto });
    app.log.info('✅ El servidor esta corriendo...');
  } catch (err) {
    app.log.error(`Error al ejecutar el servidor\n ${err}`);
    const serverError: FastifyError = {
      code: 'FST_ERR_INIT_SERVER',
      name: 'ServidorError',
      statusCode: 500,
      message: `El servidor no se pudo iniciar: ${(err as Error).message}`,
    };
    throw serverError;
  }
};
