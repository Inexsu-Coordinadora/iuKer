export interface ICitaMedica {
  readonly medico: string;
  readonly tipoDocPaciente: number;
  readonly numeroDocPaciente: string;
  readonly fecha: string;
  readonly horaInicio: string;
  estado: 1 | 2 | 3 | 4 | 5; // 1: Activa, 2: Actualizada, 3: Reprogramada, 4: Finalizada, 5: Cancelada
  readonly idCitaAnterior?: string | null;
}