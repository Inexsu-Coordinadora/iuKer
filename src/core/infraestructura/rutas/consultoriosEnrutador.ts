import { FastifyInstance } from "fastify";
import { ConsultoriosControlador } from "../../infraestructura/controladores/ConsultoriosControlador.js";
import { IConsultoriosRepositorio } from "../../dominio/Consultorio/IConsultoriosRepositorio.js";
import { ConsultorioRepositorio } from "../postgres/ConsultoriosRepositorio.js"
import { ConsultorioCasosUso } from "../../aplicacion/Consultorio/ConsultoriosCasosUso.js";

function consultorioEnrutador(
  app: FastifyInstance,
  consultoriosControlador: ConsultoriosControlador
) {
  app.post("/consultorios", consultoriosControlador.agregarConsultorio);
  app.get("/consultorios", consultoriosControlador.listarConsultorios);
  app.get("/consultorios/:idConsultorio", consultoriosControlador.obtenerConsultorioPorId);
  app.put("/consultorios/:idConsultorio", consultoriosControlador.actualizarConsultorio);
  app.delete("/consultorios/:idConsultorio", consultoriosControlador.eliminarConsultorio);
}

export async function construirConsultorioEnrutador(app: FastifyInstance) {
  const consultorioRepositorio: IConsultoriosRepositorio = new ConsultorioRepositorio();
  const consultorioCasosUso = new ConsultorioCasosUso(consultorioRepositorio);
  const consultorioControlador = new ConsultoriosControlador(consultorioCasosUso);

  consultorioEnrutador(app, consultorioControlador);
}