import { IRepositorioPacientes } from '../../dominio/Paciente/IRepositorioPacientes.js';
import { IPaciente } from '../../dominio/Paciente/IPaciente.js';
import { ejecutarConsulta } from './clientePostgres.js';
import { Paciente } from '../../dominio/Paciente/Paciente.js';

export class RepositorioPacientes implements IRepositorioPacientes {
  private mapearFila(paciente: IPaciente) {
    return {
      nombre: paciente.nombre,
      apellidos: paciente.apellidos,
      fecha_nacimiento: paciente.fecha_nacimiento,
      sexo: paciente.sexo,
      email: paciente.email,
      telefono: paciente.telefono,
      direccion: paciente.direccion,
    };
  }

  async obtenerPacientes(limite?: number): Promise<IPaciente[]> {
    let query = 'SELECT * FROM pacientes';
    const valores: number[] = [];

    if (limite !== undefined) {
      query += ' LIMIT $1';
      valores.push(limite);
    }

    const result = await ejecutarConsulta(query, valores);
    return result.rows.map((filaDB) => new Paciente(filaDB));
  }

  async obtenerPacientePorId(idPaciente: string): Promise<IPaciente> {
    const query = 'SELECT * FROM pacientes WHERE idPaciente = $1';
    const result = await ejecutarConsulta(query, [idPaciente]);

    const filaDB = result.rows[0] || null;

    return new Paciente(filaDB);
  }

  async crearPaciente(nuevoPaciente: IPaciente): Promise<string> {
    const dataBD = this.mapearFila(nuevoPaciente);
    const columnas: string[] = Object.keys(dataBD).map((key) =>
      key.toLowerCase()
    );
    const parametros: Array<string | number | Date> = Object.values(dataBD);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO pacientes (${columnas.join(', ')})
      VALUES (${placeholders})
      RETURNING
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0].idPaciente;
  }

  async actualizarPaciente(
    idPaciente: string,
    datosPaciente: IPaciente
  ): Promise<IPaciente> {
    const dataBD = this.mapearFila(datosPaciente);
    const columnas: string[] = Object.keys(dataBD).map((key) =>
      key.toLowerCase()
    );
    const parametros: Array<string | number | Date> = Object.values(dataBD);
    const clausulaSet = columnas.map((col, i) => `${col}=$${i + 1}`).join(', ');
    parametros.push(idPaciente);

    const query = `
      UPDATE pacientes
      SET ${clausulaSet}
      WHERE idPaciente=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);

    if (!result.rows[0]) {
      throw new Error(`Error al actualizar el Paciente con ID ${idPaciente}.`);
    }

    return new Paciente(result.rows[0]);
  }

  async borrarPaciente(idPaciente: string): Promise<void> {
    await ejecutarConsulta('DELETE FROM pacientes WHERE idPaciente = $1', [
      idPaciente,
    ]);
  }
}
