import { IAsignacionMedicoRepositorio } from "../../dominio/asignacionMedico/IAsignacionMedicoRepositorio.js";
import { ICitasMedicasRepositorio } from "../../dominio/citaMedica/ICitasMedicasRepositorio.js";
import { IMedico } from "../../dominio/medico/IMedico.js";
import { IMedicosRepositorio } from "../../dominio/medico/IMedicosRepositorio.js";
import { MedicoDTO, MedicoActualizarDTO } from "../../infraestructura/esquemas/medicoEsquema.js";
import { IMedicosCasosUso } from "./IMedicosCasosUso.js";

export class MedicosCasosUso implements IMedicosCasosUso{
    constructor (
        private medicosRepositorio : IMedicosRepositorio,
        private asignacionMedicoRepositorio : IAsignacionMedicoRepositorio,
        private citasMedicasRepositorio : ICitasMedicasRepositorio
    ) {}

    async crearMedico(datosMedico : MedicoDTO) : Promise <string> {
        return await this.medicosRepositorio.crearMedico(datosMedico);
    }

    async listarMedicos(limite? : number) : Promise <IMedico[]> {
        return await this.medicosRepositorio.listarMedicos(limite);
    };

    async obtenerMedicoPorTarjetaProfesional(tarjetaProfesional : string) : Promise <IMedico | null> {
        return await this.medicosRepositorio.obtenerMedicoPorTarjetaProfesional(tarjetaProfesional);
    };

    async actualizarMedico(tarjetaProfesional : string, datosMedico : MedicoActualizarDTO) : Promise <IMedico | null> {
        return await this.medicosRepositorio.actualizarMedico(tarjetaProfesional, datosMedico);
    }

    async eliminarMedico(tarjetaProfesional : string) : Promise <void> {
        await this.asignacionMedicoRepositorio.eliminarAsignacion(tarjetaProfesional);
        await this.citasMedicasRepositorio.eliminarCitasPorMedico(tarjetaProfesional);
        await this.medicosRepositorio.eliminarMedico(tarjetaProfesional);
    }
}