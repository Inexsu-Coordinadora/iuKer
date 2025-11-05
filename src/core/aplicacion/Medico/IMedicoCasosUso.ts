import { IMedico } from "../../dominio/Medico/IMedico.js";
import { MedicoDTO, MedicoActualizarDTO } from "../../infraestructura/esquemas/medicoEsquema.js";

export interface IMedicoCasosUso {
    crearMedico(datosMedico : MedicoDTO) : Promise <string>;
    listarMedicos(limite? : number) : Promise <IMedico[]>;
    obtenerMedicoPorTarjetaProfesional(tarjetaProfesional : string) : Promise <IMedico | null>; 
    actualizarMedico(tarjetaProfesional : string, datosMedico : MedicoActualizarDTO) : Promise <IMedico | null>;
    eliminarMedico(tarjetaProfesional : string) : Promise <void>;
}