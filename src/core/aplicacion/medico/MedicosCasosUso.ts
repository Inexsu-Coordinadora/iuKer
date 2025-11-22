import { IAsignacionMedicoRepositorio } from "../../dominio/asignacionMedico/IAsignacionMedicoRepositorio.js";
import { ICitasMedicasRepositorio } from "../../dominio/citaMedica/ICitasMedicasRepositorio.js";
import { IMedico } from "../../dominio/medico/IMedico.js";
import { IMedicosRepositorio } from "../../dominio/medico/IMedicosRepositorio.js";
import { MedicoActualizarDTO } from "../../infraestructura/esquemas/medicoEsquema.js";
import { IMedicosCasosUso } from "./IMedicosCasosUso.js";
import { IMedicoRepuestaDTO } from "../../infraestructura/repositorios/postgres/dtos/MedicoRespuestaDTO.js";

export class MedicosCasosUso implements IMedicosCasosUso{
    constructor (
        private medicosRepositorio : IMedicosRepositorio,
        private asignacionMedicoRepositorio : IAsignacionMedicoRepositorio,
        private citasMedicasRepositorio : ICitasMedicasRepositorio
    ) {}

    async crearMedico(datosMedico : IMedico) : Promise <IMedicoRepuestaDTO> {
        return await this.medicosRepositorio.crearMedico(datosMedico);
    }

    async listarMedicos(limite? : number) : Promise <IMedicoRepuestaDTO[]> {
        return await this.medicosRepositorio.listarMedicos(limite);
    };

    async obtenerMedicoPorTarjetaProfesional(tarjetaProfesional : string) : Promise <IMedicoRepuestaDTO | null> {
        return await this.medicosRepositorio.obtenerMedicoPorTarjetaProfesional(tarjetaProfesional);
    };

    async actualizarMedico(tarjetaProfesional : string, datosMedico : MedicoActualizarDTO) : Promise <IMedicoRepuestaDTO | null> {
        return await this.medicosRepositorio.actualizarMedico(tarjetaProfesional, datosMedico);
    }

    async eliminarMedico(tarjetaProfesional : string) : Promise <void> {
        await this.asignacionMedicoRepositorio.eliminarAsignacion(tarjetaProfesional);
        await this.citasMedicasRepositorio.eliminarCitasPorMedico(tarjetaProfesional);
        await this.medicosRepositorio.eliminarMedico(tarjetaProfesional);
    }
}