import { FastifyInstance } from 'fastify';
import { MedicosControlador } from '../controladores/MedicosControlador.js';
import { IMedicoRepositorio } from '../../dominio/Medico/IMedicoRepositorio.js';
import { MedicoCasosUso } from '../../aplicacion/Medico/MedicoCasosUso.js';
import { MedicoRepositorio } from '../postgres/MedicosRepositorio.js';

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
    const medicosRepositorio : IMedicoRepositorio = new MedicoRepositorio();
    const medicosCasosUso = new MedicoCasosUso(medicosRepositorio);
    const medicosController = new MedicosControlador(medicosCasosUso);

    medicosEnrutador(app, medicosController);
}