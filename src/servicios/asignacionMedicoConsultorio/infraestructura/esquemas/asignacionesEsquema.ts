import { z } from 'zod';
import { crearMedicoEsquema } from '../../../../core/infraestructura/esquemas/medicoEsquema.js';
import { CrearConsultorioEsquema } from '../../../../core/infraestructura/esquemas/consultorioEsquema.js';

// Expresión regular (RegEx) para validar el formato de hora HH:MM. Ej: 08:00 o 23:59
const HORA_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const TarjetaProfesionalSchema = crearMedicoEsquema.shape.tarjetaProfesional;
const ConsultorioIdSchema = CrearConsultorioEsquema.shape.idConsultorio;

export const AsignacionCreacionEsquema = z
  .object({
    tarjetaProfesionalMedico: TarjetaProfesionalSchema.max(50),

    idConsultorio: ConsultorioIdSchema.max(5),

    diaSemana: z
      .number()
      .int('El día de la semana debe ser un número entero (sin decimales).')
      .min(1, 'El día de la semana debe ser 1 (Lunes) o mayor.')
      .max(7, 'El día de la semana debe ser 7 (Domingo) o menor.'),

    inicioJornada: z
      .string()
      .regex(
        HORA_REGEX,
        'El formato de hora de inicio es inválido. Use HH:MM (Ej: 08:00).'
      )
      .nonempty('La hora de inicio es obligatoria.'),

    finJornada: z
      .string()
      .regex(
        HORA_REGEX,
        'El formato de hora de fin es inválido. Use HH:MM (Ej: 17:00).'
      )
      .nonempty('La hora de fin es obligatoria.'),
  })
  .strict()

  // Inicio debe ser anterior a Fin.
  .refine((data) => data.inicioJornada < data.finJornada, {
    message:
      'La hora de inicio de la jornada tiene que ser anterior a la hora de fin.',
    path: ['inicioJornada'],
  });

export type IAsignacionCreacionDTO = z.infer<typeof AsignacionCreacionEsquema>;
