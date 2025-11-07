import { IRepositorioConsultorio } from "../../dominio/Consultorio/IRepositorioConsultorio.js";
import { ejecutarConsulta } from "./clientePostgres.js";
import { IConsultorio } from "../../dominio/Consultorio/IConsultorio.js";
import { camelCaseASnakeCase } from '../../../common/camelCaseASnakeCase.js';

export class ConsultorioRepositorio implements IRepositorioConsultorio {

  async agregarConsultorio(datosConsultorio:IConsultorio): Promise<string> {
    const columnas = Object.keys(datosConsultorio).map((key) => camelCaseASnakeCase(key));
    const params: Array<string | number> = Object.values(datosConsultorio);
    const placeholders = columnas.map((_,i)=> `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO consultorios (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;
    const resultado = await ejecutarConsulta(query,params);
    return resultado.rows[0].idConsultorio
  }
  async listarConsultorios(limite?: number): Promise<IConsultorio[]> {
    let query = "SELECT * FROM consultorios";
    const valores: number[] = [];

    if (limite !== undefined){
      query += " LIMIT $1";
      valores.push(limite);
    }

    const resultado = await ejecutarConsulta(query, valores);
    return resultado.rows;
  }
  async obtenerConsultorioPorId(idConsultorio: string): Promise<IConsultorio | null> {
    const query = "SELECT * FROM consultorios WHERE id_consultorio = $1";
    const resultado = await ejecutarConsulta(query,[idConsultorio]);
    return resultado.rows[0] || null
  }
  async actualizarConsultorio(idConsultorio:string, datosConsultorio:IConsultorio): Promise<IConsultorio>{
    const columnas = Object.keys(datosConsultorio).map((key) => camelCaseASnakeCase(key));
    const params: Array<string | number> = Object.values(datosConsultorio);
    const setClause = columnas.map((col,i) => `${col}=$${i + 1}`).join(", ");
    params.push(idConsultorio);

    const query = `
      UPDATE consultorios
      SET ${setClause}
      WHERE id_consultorio = $${params.length}
      RETURNING *;
    `

    const resultado = await ejecutarConsulta(query, params);
    return resultado.rows[0];
  }
  async eliminarConsultorio(idConsultorio: string): Promise<void> {
    await ejecutarConsulta(
      "DELETE FROM consultorios WHERE id_consultorio = $1", [idConsultorio]);
  }
}