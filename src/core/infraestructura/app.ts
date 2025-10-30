import Fastify from "fastify";
import { FastifyError } from "fastify";
import { configuracion } from "../../common/Configuracion.js";
// Se debe agregar enrutador

const app = Fastify({ logger: true });

app.register(
  async (appInstance) => {
    // Se debe inicializar el enrutador
    // construirPlatosEnrutador(appInstance);
  },
  { prefix: "/api" }
);

export const startServer = async (): Promise<void> => {
  try {
    await app.listen({ port: configuracion.httpPuerto });
    app.log.info("✅ El servidor esta corriendo...");
  } catch (err) {
    app.log.error(`❌ Error al ejecutar el servidor\n ${err}`);
    const serverError: FastifyError = {
      code: "FST_ERR_INIT_SERVER",
      name: "ServidorError",
      statusCode: 500,
      message: `El servidor no se pudo iniciar: ${(err as Error).message}`,
    };
    throw serverError;
  }
};