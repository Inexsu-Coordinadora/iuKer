import { IAsignacionMedico } from './IAsignacionMedico.js';

export interface IAsignacionMedicoRepositorio {
  existeAsignacion(
    tarjetaProfesionalMedico: string,
    idConsultorio: string,
    diaSemana: number,
    inicioJornada: string,
    finJornada: string
  ): Promise<boolean>;

  crearAsignacion(nuevaAsignacion: IAsignacionMedico): Promise<string>;

  existeAsignacion(
    tarjetaProfesionalMedico: string,
    idConsultorio: string,
    diaSemana: number,
    inicioJornada: string,
    finJornada: string
  ): Promise<boolean>;

  consultorioOcupado(
    idConsultorio: string,
    diaSemana: number,
    inicio_jornada: string,
    fin_jornada: string
  ): Promise<boolean>;
}
