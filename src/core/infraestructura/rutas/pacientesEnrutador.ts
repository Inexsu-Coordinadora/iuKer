import { FastifyInstance } from "fastify";
import { IRepositrioPacientes } from "../../dominio/Paciente/IRepositorioPacientes.js";
import { RepositorioPacientes } from "../postgres/RepositorioPacientes.js";
import { PacienteCasosUso } from "../../aplicacion/Paciente/PacienteCasosUso.js";
import { PacientesControlador } from "../controladores/PacientesControlador.js";

function pacientesEnrutador(
  app: FastifyInstance,
  pacientesControlador: PacientesControlador
) {
  app.get("/pacientes", pacientesControlador.obtenerPacientes);
  app.get("/pacientes/:idPaciente", pacientesControlador.obtenerPacientePorId);
  app.post("/pacientes", pacientesControlador.crearPaciente);
  app.put("/pacientes/:idPaciente", pacientesControlador.actualizarPaciente);
  app.delete("/pacientes/:idPaciente", pacientesControlador.borrarPaciente);
}

export async function construirPacientesEnrutador(app: FastifyInstance) {
  const repositorioPacientes: IRepositrioPacientes = new RepositorioPacientes();
  const platosCasosUso = new PacienteCasosUso();
  const pacientesControlador = new PacientesControlador();

  pacientesEnrutador(app, pacientesControlador);
}
