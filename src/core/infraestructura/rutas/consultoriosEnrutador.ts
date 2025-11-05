import { FastifyInstance } from "fastify";
import { ConsultoriosControlador } from "../../infraestructura/controladores/ConsultoriosControlador.js";
import { IRepositorioConsultorio } from "../../dominio/Consultorio/IRepositorioConsultorio.js";
import { ConsultorioRepositorio } from "../postgres/ConsultorioRepository.js"
import { ConsultorioCasosUso } from "../../aplicacion/Consultorio/ConsultorioCasosUso.js";

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
  const consultorioRepositorio: IRepositorioConsultorio = new ConsultorioRepositorio();
  const consultorioCasosUso = new ConsultorioCasosUso(consultorioRepositorio);
  const consultorioControlador = new ConsultoriosControlador(consultorioCasosUso);

  consultorioEnrutador(app, consultorioControlador);
}