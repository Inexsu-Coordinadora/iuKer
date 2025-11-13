import { IPacientesRepositorio } from '../../dominio/Paciente/IPacientesRepositorio.js';
import { IPaciente } from '../../dominio/Paciente/IPaciente.js';
import { ejecutarConsulta } from './clientePostgres.js';
import { Paciente } from '../../dominio/Paciente/Paciente.js';
import { camelCaseASnakeCase } from '../../../common/camelCaseASnakeCase.js';

export class PacientesRepositorio implements IPacientesRepositorio {
  async existePacientePorDocumento(numeroDoc: string, tipoDoc: number): Promise<boolean> {
    // Consulta optimizada: solo necesitamos saber si existe una fila que coincida.
    const query = 'SELECT 1 FROM pacientes WHERE numero_doc = $1 AND tipo_doc = $2 LIMIT 1';
    const result = await ejecutarConsulta(query, [numeroDoc, tipoDoc]);

    // Si la consulta devuelve al menos una fila (length > 0), el paciente existe.
    return result.rows.length > 0;
  }

  async obtenerPacientes(limite?: number): Promise<IPaciente[]> {
    let query = 'SELECT * FROM pacientes';
    const limiteParam: number[] = [];

    if (limite !== undefined) {
      query += ' LIMIT $1';
      limiteParam.push(limite);
    }

    const result = await ejecutarConsulta(query, limiteParam);
    return result.rows;
  }

  async obtenerPacientePorId(numeroDoc: string): Promise<IPaciente> {
    const query = 'SELECT * FROM pacientes WHERE numero_doc = $1';
    const result = await ejecutarConsulta(query, [numeroDoc]);

    return result.rows[0] || null;
<<<<<<< HEAD
=======
    // const filaDB = result.rows[0] || null;
    // return new Paciente(filaDB);
>>>>>>> feature/consulta-citas-paciente
  }

  async crearPaciente(nuevoPaciente: IPaciente): Promise<string> {
    const columnas: string[] = Object.keys(nuevoPaciente).map((key) => camelCaseASnakeCase(key));
    const parametros: Array<string | number | Date> = Object.values(nuevoPaciente);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO pacientes (${columnas.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0].numeroDoc;
  }

  async actualizarPaciente(numeroDoc: string, datosPaciente: IPaciente): Promise<IPaciente> {
    const columnas: string[] = Object.keys(datosPaciente).map((key) => camelCaseASnakeCase(key));
    const parametros: Array<string | number | Date> = Object.values(datosPaciente);
    const clausulaSet = columnas.map((col, i) => `${col}=$${i + 1}`).join(', ');
    parametros.push(numeroDoc);

    const query = `
      UPDATE pacientes
      SET ${clausulaSet}
      WHERE numero_doc=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);

    if (!result.rows[0]) {
      throw new Error(`Error al actualizar el Paciente con ID ${numeroDoc}.`);
    }

    return new Paciente(result.rows[0]);
  }

  async borrarPaciente(numeroDoc: string): Promise<void> {
    await ejecutarConsulta('DELETE FROM pacientes WHERE numero_doc = $1', [numeroDoc]);
  }
}
