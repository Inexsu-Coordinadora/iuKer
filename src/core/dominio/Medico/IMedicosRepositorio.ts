import { IMedico } from './IMedico.js'

export interface IMedicosRepositorio {
    crearMedico(datosMedico : IMedico) : Promise <string>;
    listarMedicos(limite? : number) : Promise <IMedico[]>;
    obtenerMedicoPorTarjetaProfesional(tarjetaProfesional : string) : Promise <IMedico | null>; 
    actualizarMedico(tarjetaProfesional : string, datosMedico : Partial <IMedico>) : Promise <IMedico | null>;
    eliminarMedico(tarjetaProfesional : string) : Promise <void>;
};