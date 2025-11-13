import { IMedicosRepositorio } from '../../dominio/Medico/IMedicosRepositorio.js';
import { ejecutarConsulta } from './clientePostgres.js';
import { IMedico } from '../../dominio/Medico/IMedico.js';
import { camelCaseASnakeCase } from '../../../common/camelCaseASnakeCase.js';

export class MedicosRepositorio implements IMedicosRepositorio {
    async crearMedico(datosMedico : IMedico) : Promise <string> {
        const keys = Object.keys(datosMedico);
        const snakeColumn = keys.map((k) => camelCaseASnakeCase(k));
        const parametros = keys.map((k) => (datosMedico as any) [k]);
        const placeholders = parametros.map((_,i) => `$${i+1}`).join(", ");

        const query = `
        INSERT INTO medicos (${snakeColumn.join(", ")})
        VALUES (${placeholders})
        RETURNING tarjeta_profesional AS "tarjetaProfesional";
        `;

        const respuesta = await ejecutarConsulta(query, parametros);

        return respuesta.rows[0].tarjetaProfesional;
    };

    async listarMedicos(limite? : number) : Promise <IMedico[]> {
        let query = 
        `SELECT tarjeta_profesional, tipo_doc, numero_doc, nombre, 
        apellido, fecha_nacimiento, sexo, especialidad, email, telefono
        FROM medicos`;
        
        const valores : number[] = [];

        if(limite !== undefined){
            query += ' LIMIT $1';
            valores.push(limite); 
        }

        return (await ejecutarConsulta(query, valores)).rows;
    };
    
    async obtenerMedicoPorTarjetaProfesional(tarjetaProfesional: string) : Promise <IMedico | null> {
        const query = `
        SELECT tarjeta_profesional, tipo_doc, numero_doc, nombre, 
        apellido, fecha_nacimiento, sexo, especialidad, email, telefono
        FROM medicos 
        WHERE tarjeta_profesional = $1
        `;
        return (await ejecutarConsulta(query,[tarjetaProfesional])).rows[0] || null;
    }; 
    
    async actualizarMedico(tarjetaProfesional : string, datosMedico : Partial <IMedico>) : Promise <IMedico | null> {

        const entries = Object.entries(datosMedico).filter(([, v]) => v !== undefined);
        if (entries.length === 0) {
            return await this.obtenerMedicoPorTarjetaProfesional(tarjetaProfesional);
        }

        const snakeColumn = entries.map(([k]) => camelCaseASnakeCase(k));
        const parametros = entries.map(([, v]) => v);
        const setClause = snakeColumn.map((col,i) => `${col}=$${i+1}`).join(", ");
        parametros.push(tarjetaProfesional);

        const query =`
        UPDATE medicos
        SET ${setClause}
        WHERE tarjeta_profesional = $${parametros.length}
        RETURNING *;
        `;

        return (await ejecutarConsulta(query,parametros)).rows[0];
    };

    async eliminarMedico(tarjetaProfesional : string) : Promise <void>{
        await ejecutarConsulta("DELETE FROM medicos WHERE tarjeta_profesional = $1", [tarjetaProfesional]);
    };
}