import { camelCaseASnakeCase } from '../../../common/camelCaseASnakeCase.js';
import { ICitaMedica } from '../../dominio/CitaMedica/ICitaMedica.js';
import { IRepositorioCitaMedica } from '../../dominio/CitaMedica/IRepositorioCitaMedica.js';
import { ejecutarConsulta } from './clientePostgres.js';
import { conversionAFechaColombia } from '../../../common/conversionAFechaColombia.js';
import { citaMedicaDTO } from '../esquemas/citaMedicaEsquema.js';

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
    const parametros: Array<string | number> = Object.values(datosCitaMedica);
    const placeHolders = columnas.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO citas_medicas (${columnas.join(', ')})
      VALUES (${placeHolders})
      RETURNING *;
    `;

    const respuesta = await ejecutarConsulta(query, parametros);
    return respuesta.rows[0];
  }

  async eliminarCita(idCita: string): Promise<void> {
    // Primero eliminar las citas que dependen de esta
    await ejecutarConsulta(
      'DELETE FROM citas_medicas WHERE id_cita_anterior = $1',
      [idCita]
    );
    // Luego eliminar la cita original
    await ejecutarConsulta(
      'DELETE FROM citas_medicas WHERE id_cita = $1',
      [idCita]
    );
  }
  // Verifica si existe Traslape para un medico en una fecha y hora especifica
  // Excluye citas canceladas y, si se desea, una cita especifica
  async verificarTraslapeMedico(
    medico: string,
    fecha: string,
    horaInicio: string,
    idCitaAExcluir?: string
  ): Promise<{hayTraslape: boolean, citaConflicto?:ICitaMedica}>{
    const fechaColombia = conversionAFechaColombia(fecha, horaInicio);

    let query = `
      SELECT * FROM citas_medicas
      WHERE medico = $1
      AND fecha = $2
      AND estado != 5
      AND (
        (hora_inicio, hora_fin) OVERLAPS ($3::TIME, ($3::TIME + '30 minutes'::INTERVAL))
      )
    `;

    const params: any[] = [medico, fechaColombia, horaInicio];
    // Usado para excluir la cita a la hora de reprogramar, para evitar traslape
    if (idCitaAExcluir){
      query += ` AND id_cita != $4`;
      params.push(idCitaAExcluir);
    }

    const resultado = await ejecutarConsulta(query, params);
    return {
      hayTraslape: resultado.rows.length > 0,
      citaConflicto: resultado.rows[0] || undefined
    };
  }
  // Verifica si existe traslape para un paciente en una fecha y hora especifica
  async verificarTraslapePaciente(
    tipoDocPaciente: number,
    numeroDocPaciente: string,
    fecha: string,
    horaInicio: string,
    idCitaAExcluir?: string
  ): Promise<{hayTraslape: boolean; citaConflicto?: ICitaMedica}>{
    const fechaColombia = conversionAFechaColombia(fecha, horaInicio);
    let query = `
      SELECT * FROM citas_medicas
      WHERE tipo_doc_paciente = $1
      AND numero_doc_paciente = $2
      AND fecha = $3
      AND estado != 5
      AND (
      (hora_inicio, hora_fin) OVERLAPS ($4::TIME, ($4::TIME + '30 minutes'::INTERVAL))
      )
    `;

    const params: any[] = [tipoDocPaciente,numeroDocPaciente,fechaColombia,horaInicio];
    if (idCitaAExcluir){
      query += ` AND id_cita != $5`;
      params.push(idCitaAExcluir);
    }

    const resultado = await ejecutarConsulta(query,params);
    return {
      hayTraslape: resultado.rows.length > 0,
      citaConflicto: resultado.rows[0] || undefined
    };
  }
  //  Verifica si el medico tiene un turno asignado para la fecha y hora pedida
  async validarTurnoMedico(datosCitaMedica: citaMedicaDTO): Promise<boolean> {
    const fechaColombia = conversionAFechaColombia(datosCitaMedica.fecha, datosCitaMedica.horaInicio);
    const diaSemana = fechaColombia.getDay();
    const valores = [datosCitaMedica.medico, diaSemana, datosCitaMedica.horaInicio];

    const query = `
      SELECT COUNT(*) FROM asignacion_medicos
      WHERE tarjeta_profesional_medico = $1
      AND dia_semana = $2
      AND inicio_jornada <= $3::TIME
      AND fin_jornada >= ($3::TIME + INTERVAL '30 minutes');
    `;

    const resultado = await ejecutarConsulta(query, valores);

    return resultado.rows[0].count > 0;
  }
  async verificarTraslapeConsultorio(
    medico: string,
    fecha: string,
    horaInicio: string,
    idCitaAExcluir?: string
  ): Promise<{ hayTraslape: boolean; citaConflicto?: ICitaMedica}> {
    const fechaColombia = conversionAFechaColombia(fecha, horaInicio);
    const diaSemana = fechaColombia.getDay();

    const queryTurno = `
      SELECT id_consultorio FROM asignacion_medicos
      WHERE tarjeta_profesional_medico = $1
      AND dia_semana = $2
      AND inicio_jornada <= $3::TIME
      AND fin_jornada >= ($3::TIME + '30 minutes'::INTERVAL)
      LIMIT 1
    `;
    const turnoResultado = await ejecutarConsulta(
      queryTurno, [medico, diaSemana, horaInicio]
    )

    if (turnoResultado.rows.length === 0){
      return {hayTraslape: false};
    }
    const consultorio = turnoResultado.rows[0].id_consultorio;

    // se verifica si hay otras citas con el mismo horario
    let queryCitas = `
      SELECT cm.* FROM citas_medicas cm
      INNER JOIN asignacion_medicos tm ON cm.medico = tm.tarjeta_profesional_medico
      WHERE tm.id_consultorio = $1
      AND cm.fecha = $2
      AND cm.estado != 5
      AND (
        (cm.hora_inicio, cm.hora_fin) OVERLAPS ($3::TIME, ($3::TIME + '30 minutes'::INTERVAL))
      )
    `;

    const params: any[] = [consultorio, fecha, horaInicio];

    if (idCitaAExcluir){
      queryCitas += ` AND cm.id_cita != $4`;
      params.push(idCitaAExcluir);
    }

    const citasResultado = await ejecutarConsulta(queryCitas, params);
    return {
      hayTraslape: citasResultado.rows.length > 0,
      citaConflicto: citasResultado.rows[0] || undefined
    };
  }
  // Reprograma una cita creando una nueva con referencia a la anterior
  async reprogramarCita(
      idCitaAnterior: string,
      nuevasCitas: ICitaMedica
    ): Promise<ICitaMedica> {
      await ejecutarConsulta(
        'UPDATE citas_medicas SET estado = 3 WHERE id_cita = $1::UUID',
        [idCitaAnterior]
      );
      // Crear la nueva cita con referencia a la anterior
      const citaConReferencia: ICitaMedica = {
        ...nuevasCitas,
        idCitaAnterior: idCitaAnterior,
        estado: 1 // Nueva cita con estado Activa
      };

      return await this.agendarCita(citaConReferencia);
  }
  // Cancela una cita cambiando su estado
  async cancelarCita(idCita: string): Promise<ICitaMedica> {
    const query = `
      UPDATE citas_medicas
      SET estado = 5
      WHERE id_cita = $1
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, [idCita]);
    return resultado.rows[0];
  }
  async finalizarCita(idCita: string): Promise<ICitaMedica> {
    const query = `
      UPDATE citas_medicas
      SET estado = 4
      WHERE id_cita = $1
      RETURNING *;
    `;

    const resultado = await ejecutarConsulta(query, [idCita]);
    return resultado.rows[0];
  }
}