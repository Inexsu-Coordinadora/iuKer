import { IMedico } from './IMedico.js'

export interface IMedicoRepositorio {
    crearMedico(datosMedico : IMedico) : Promise <string>;
    listarMedicos(limite? : number) : Promise <IMedico[]>;
    obtenerMedicoPorTarjetaProfesional(tarjetaProfesional : string) : Promise <IMedico | null>; 
    actualizarMedico(tarjetaProfesional : string, datosMedico : IMedico) : Promise <IMedico | null>;
    eliminarMedico(tarjetaProfesional : string) : Promise <void>;
};