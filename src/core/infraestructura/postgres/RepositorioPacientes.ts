import { IRepositrioPacientes } from '../../dominio/Paciente/IRepositorioPacientes.js';
import { IPaciente } from '../../dominio/Paciente/IPaciente.js';
import { ejecutarConsulta } from './clientePostgres.js';

export class RepositorioPacientes implements IRepositrioPacientes {
  async obtenerPacientes(limite?: number): Promise<IPaciente[]> {
    let query = 'SELECT * FROM pacientes';
    const valores: number[] = [];

    if (limite !== undefined) {
      query += ' LIMIT $1';
      valores.push(limite);
    }

    const result = await ejecutarConsulta(query, valores);
    return result.rows;
  }

  async obtenerPacientePorId(idPaciente: string): Promise<IPaciente> {
    const query = 'SELECT * FROM pacientes WHERE idPaciente = $1';
    const result = await ejecutarConsulta(query, [idPaciente]);
    return result.rows[0] || null;
  }

  async crearPaciente(nuevoPaciente: IPaciente): Promise<string> {
    const columnas: string[] = Object.keys(nuevoPaciente).map((key) =>
      key.toLowerCase()
    );
    const parametros: Array<string | number> = Object.values(nuevoPaciente);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO pacientes (${columnas.join(', ')})
      VALUES (${placeholders})
      RETURNING
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0].id;
  }

  async actualizarPaciente(
    idPaciente: string,
    datosPaciente: IPaciente
  ): Promise<IPaciente> {
    const columnas: string[] = Object.keys(datosPaciente).map((key) =>
      key.toLowerCase()
    );
    const parametros: Array<string | number> = Object.values(datosPaciente);
    const clausulaSet = columnas.map((col, i) => `${col}=$${i + 1}`).join(', ');
    parametros.push(idPaciente);

    const query = `
      UPDATE platos
      SET ${clausulaSet}
      WHERE idPaciente=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0];
  }

  async borrarPaciente(idPaciente: string): Promise<void> {
    await ejecutarConsulta('DELETE FROM platos WHERE idPaciente = $1', [
      idPaciente,
    ]);
  }
}
