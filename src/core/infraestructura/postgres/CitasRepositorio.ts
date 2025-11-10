import { camelCaseASnakeCase } from '../../../common/camelCaseASnakeCase.js';
import { ICitaMedica } from '../../dominio/CitaMedica/ICitaMedica.js';
import { IRepositorioCitaMedica } from '../../dominio/CitaMedica/IRepositorioCitaMedica.js';
import { citaMedicaDTO } from '../esquemas/citaMedicaEsquema.js';
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

  //---------------------------------------------------------------

  async disponibilidadMedico(datosCitaMedica: citaMedicaDTO): Promise<boolean> {
    const valores = [datosCitaMedica.medico, datosCitaMedica.fecha, datosCitaMedica.horaInicio];

    const query = `
      SELECT COUNT(*) FROM citas_medicas
      WHERE medico = $1
      AND fecha = $2
      AND hora_inicio < ($3::time + INTERVAL '30 minutes')
      AND hora_fin > $3::time;
    `;

    const resultado = await ejecutarConsulta(query, valores);

    return resultado.rows[0].count > 0;
  }

  async validarCitasPaciente(datosCitaMedica: citaMedicaDTO): Promise<boolean> {
    const valores = [
      datosCitaMedica.tipoDocPaciente,
      datosCitaMedica.numeroDocPaciente,
      datosCitaMedica.fecha,
      datosCitaMedica.horaInicio,
    ];

    const query = `
      SELECT COUNT(*) FROM citas_medicas
      WHERE tipo_doc_paciente = $1
      AND numero_doc_paciente = $2
      AND fecha = $3
      AND hora_inicio < ($4::time + INTERVAL '30 minutes')
      AND hora_fin > $4::time;
    `;

    const resultado = await ejecutarConsulta(query, valores);

    return resultado.rows[0].count > 0;
  }

  // async obtenerConsultorioDeTurno(datosCitaMedica: citaMedicaDTO): Promise<string | null> {
  //   const valores = [datosCitaMedica.medico, datosCitaMedica.fecha];

  //   /* const query = `
  //     SELECT id_consultorio
  //     FROM turnos_medicos
  //     WHERE medico = $1
  //     AND fecha = $2
  //     AND inicio_turno <= $3::time
  //     AND fin_turno > $3::time + INTERVAL '30 minutes';
  //   `; */

  //   const query = `
  //     SELECT id_consultorio
  //     FROM turnos_medicos
  //     WHERE medico = $1
  //     AND fecha = $2;
  //   `;

  //   const resultado = await ejecutarConsulta(query, valores);

  //   return resultado.rows[0]?.id_consultorio || null;
  // }

  // async disponibilidadConsultorio(datosCitaMedica: citaMedicaDTO, idConsultorio: string): Promise<boolean> {
  //   const valores = [idConsultorio, datosCitaMedica.fecha, datosCitaMedica.horaInicio];

  //   const query = `
  //     SELECT COUNT(*) FROM citas_medicas cm
  //     JOIN turnos_medicos tm ON cm.medico = tm.medico
  //     WHERE tm.id_consultorio = $1
  //     AND cm.fecha = $2
  //     AND cm.hora_inicio < ($3::time + INTERVAL '30 minutes')
  //     AND cm.hora_fin > $3::time;
  //   `;

  //   const resultado = await ejecutarConsulta(query, valores);

  //   return resultado.rows[0].count > 0;
  // }

  async validarTurnoMedico(datosCitaMedica: citaMedicaDTO): Promise<boolean> {
    const valores = [datosCitaMedica.medico, datosCitaMedica.fecha, datosCitaMedica.horaInicio];

    const query = `
      SELECT COUNT(*) FROM turnos_medicos
      WHERE medico = $1
      AND fecha = $2
      AND inicio_turno <= $3::TIME
      AND fin_turno >= ($3::TIME + INTERVAL '30 minutes');
    `;

    const resultado = await ejecutarConsulta(query, valores);

    return resultado.rows[0].count > 0;
  }

  //---------------------------------------------------------------

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
}
