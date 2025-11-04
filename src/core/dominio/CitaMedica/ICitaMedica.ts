export interface ICitaMedica {
  readonly idCita: string;
  readonly medico: string;
  readonly tipoDocPaciente: number;
  readonly numeroDocPaciente: string;
  readonly idConsultorio: string;
  readonly fecha: string;
  readonly horaInicio: string;
  readonly duracion: string;
  estado: number; // 1: Activa, 2: Actualizada, 3: Reprogramada, 4: Finalizada, 5: Cancelada
}
