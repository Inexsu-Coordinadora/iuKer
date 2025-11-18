import { camelCaseASnakeCase } from '../../../common/camelCaseASnakeCase.js';
import { ICitaMedica } from '../../dominio/CitaMedica/ICitaMedica.js';
import { IRepositorioCitaMedica } from '../../dominio/CitaMedica/IRepositorioCitaMedica.js';
import { ejecutarConsulta } from './clientePostgres.js';

export class CitasRepositorio implements IRepositorioCitaMedica {
  async obtenerCitas(limite?: number): Promise<ICitaMedica[]> {
    let query = 'SELECT * FROM citas_medicas';
    const valores: number[] = [];

    if (limite !== undefined) {
      query += ' LIMIT $1';
      valores.push(limite);
    }

    const resultado = await ejecutarConsulta(query, valores);
    return resultado.rows;
  }

  async obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null> {
    const query = 'SELECT * FROM citas_medicas WHERE id_cita = $1';
    const resultado = await ejecutarConsulta(query, [idCita]);

    return resultado.rows[0] || null;
  }

  async agendarCita(datosCitaMedica: ICitaMedica): Promise<ICitaMedica> {
    const columnas = Object.keys(datosCitaMedica).map((key) => camelCaseASnakeCase(key));
    const parametros: Array<string | number | Date> = Object.values(datosCitaMedica);
    const placeHolders = columnas.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
    INSERT INTO citas_medicas (${columnas.join(', ')})
    VALUES (${placeHolders})
    RETURNING *;
    `;

    const respuesta = await ejecutarConsulta(query, parametros);
    return respuesta.rows[0];
  }

  async cambiarEstado(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica> {
    const columnas: string[] = Object.keys(datosCitaMedica).map((key) => camelCaseASnakeCase(key));
    const parametros: Array<string | number | Date> = Object.values(datosCitaMedica);
    const setClause = columnas.map((columna, i) => `${columna}=$${i + 1}`).join(', ');
    parametros.push(idCita);

    const query = `
    UPDATE citas_medicas
    SET ${setClause}
    WHERE id_cita = $${parametros.length}
    RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, parametros);
    return resultado.rows[0];
  }

  async eliminarCita(idCita: string): Promise<void> {
    await ejecutarConsulta('DELETE FROM citas_medicas WHERE id_cita = $1', [idCita]);
  }

  async obtenerCitasPorPaciente(numeroDoc: string, limite?: number) : Promise <any[]> {
    const parametros: Array<string | number> = [numeroDoc];
    let query = `
    SELECT c.fecha, c.hora_inicio, c.estado, (m.nombre || ' ' || COALESCE (m.apellido, '')) AS nombre_medico, co.ubicacion
    FROM citas_medicas c
    LEFT JOIN medicos m ON m.tarjeta_profesional = c.medico
    LEFT JOIN asignacion_medicos am ON am.tarjeta_profesional_medico = m.tarjeta_profesional
    LEFT JOIN consultorios co ON co.id_consultorio = am.id_consultorio
    WHERE c.numero_doc_paciente = $1
    ORDER BY c.fecha ASC
    `
    if(limite !== undefined){
      query += ' LIMIT $2';
      parametros.push(limite);
    }

    return (await ejecutarConsulta(query, parametros)).rows;
  }
}
