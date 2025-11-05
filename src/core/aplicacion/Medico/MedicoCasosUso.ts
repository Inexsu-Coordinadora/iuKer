import { IMedico } from "../../dominio/Medico/IMedico.js";
import { IMedicoRepositorio } from "../../dominio/Medico/IMedicoRepositorio.js";
import { MedicoDTO, MedicoActualizarDTO } from "../../infraestructura/esquemas/medicoEsquema.js";
import { IMedicoCasosUso } from "./IMedicoCasosUso.js";

export class MedicoCasosUso implements IMedicoCasosUso{
    constructor (private medicoRepositorio : IMedicoRepositorio) {}

    async crearMedico(datosMedico : MedicoDTO) : Promise <string> {
        return await this.medicoRepositorio.crearMedico(datosMedico);
    }

    async listarMedicos(limite? : number) : Promise <IMedico[]> {
        return await this.medicoRepositorio.listarMedicos(limite);
    };

    async obtenerMedicoPorTarjetaProfesional(tarjetaProfesional : string) : Promise <IMedico | null> {
        return await this.medicoRepositorio.obtenerMedicoPorTarjetaProfesional(tarjetaProfesional);
    };

    async actualizarMedico(tarjetaProfesional : string, datosMedico : MedicoActualizarDTO) : Promise <IMedico | null> {
        return await this.medicoRepositorio.actualizarMedico(tarjetaProfesional, datosMedico);
    }

    async eliminarMedico(tarjetaProfesional : string) : Promise <void> {
        await this.medicoRepositorio.eliminarMedico(tarjetaProfesional);
    }
}