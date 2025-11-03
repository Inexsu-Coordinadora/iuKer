export interface ICitaMedica {
  readonly idCita?: string | null;
  readonly medico: string;
  readonly tipoDocPaciente: number;
  readonly numeroDocPaciente: string;
  readonly idConsultorio: string;
  readonly fecha: Date;
  readonly horaInicio: string;
  readonly duracion: string;
  estadoCita: 1 | 2 | 3 | 4 | 5; // 1: Activa, 2: Actualizada, 3: Reprogramada, 4: Finalizada, 5: Cancelada
  idCitaAnterior?: string | null;
}
