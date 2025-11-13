import { ejecutarConsulta } from '../postgres/clientePostgres.js';
import { IAsignacionMedico } from '../../dominio/AsignacionMedico/IAsignacionMedico.js';
import { IAsignacionMedicoRepositorio } from '../../dominio/AsignacionMedico/IAsignacionMedicoRepositorio.js';
import { camelCaseASnakeCase } from '../../../common/camelCaseASnakeCase.js';

export class AsignacionMedicoRepositorio
  implements IAsignacionMedicoRepositorio
{
  async existeAsignacion(
    tarjetaProfesionalMedico: string,
    idConsultorio: string,
    diaSemana: number,
    inicioJornada: string,
    finJornada: string
  ): Promise<boolean> {
    const query =
      'SELECT 1 FROM asignacion_medicos ' +
      'WHERE tarjeta_profesional_medico = $1 ' +
      'AND id_consultorio = $2 ' +
      'AND dia_semana = $3 ' +
      'AND inicio_jornada = $4 ' +
      'AND fin_jornada = $5 LIMIT 1';

    const result = await ejecutarConsulta(query, [
      tarjetaProfesionalMedico,
      idConsultorio,
      diaSemana,
      inicioJornada,
      finJornada,
    ]);

    return result.rows.length > 0;
  }

  async consultorioOcupado(
    idConsultorio: string,
    diaSemana: number,
    inicio_jornada: string,
    fin_jornada: string
  ): Promise<boolean> {
    const query =
      'SELECT 1 FROM asignacion_medicos ' +
      'WHERE id_consultorio = $1 ' +
      'AND dia_semana = $2 ' +
      'AND inicio_jornada >= $3 ' +
      'AND fin_jornada <= $4;';

    const result = await ejecutarConsulta(query, [
      idConsultorio,
      diaSemana,
      inicio_jornada,
      fin_jornada,
    ]);

    return result.rows.length > 0;
  }

  async crearAsignacion(nuevaAsignacion: IAsignacionMedico): Promise<string> {
    //Creación si pasa la comprobación
    const columnas: string[] = Object.keys(nuevaAsignacion).map((key) =>
      camelCaseASnakeCase(key)
    );
    const parametros: any[] = Object.values(nuevaAsignacion);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO asignacion_medicos (${columnas.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0].id_asignacion;
  }

  async eliminarAsignacion(tarjetaProfesionalMedico: string): Promise<void> {
    const parametros = tarjetaProfesionalMedico;
    const query =
      'DELETE FROM asignacion_medicos ' +
      'WHERE tarjeta_profesional_medico = $1';

    await ejecutarConsulta(query, [parametros]);
  }
}
