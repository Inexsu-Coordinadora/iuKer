import { FastifyInstance } from 'fastify';
import { MedicosControlador } from '../controladores/MedicosControlador.js';
import { IMedicosRepositorio } from '../../dominio/Medico/IMedicosRepositorio.js';
import { MedicosCasosUso } from '../../aplicacion/Medico/MedicosCasosUso.js';
import { MedicosRepositorio } from '../postgres/MedicosRepositorio.js';

function medicosEnrutador(
    app : FastifyInstance,
    medicosController : MedicosControlador
) {
    app.get("/medicos", medicosController.listarMedicos);
    app.get("/medicos/:tarjetaProfesional", medicosController.obtenerMedicoPorTarjetaProfesional);
    app.post("/medicos", medicosController.crearMedico);
    app.put("/medicos/:tarjetaProfesional", medicosController.actualizarMedico);
    app.delete("/medicos/:tarjetaProfesional", medicosController.eliminarMedico);
}

export async function construirMedicosEnrutador(app: FastifyInstance){
    const medicosRepositorio : IMedicosRepositorio = new MedicosRepositorio();
    const medicosCasosUso = new MedicosCasosUso(medicosRepositorio);
    const medicosController = new MedicosControlador(medicosCasosUso);

    medicosEnrutador(app, medicosController);
}