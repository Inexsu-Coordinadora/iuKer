import { z } from 'zod';
const estadosValidos = [1, 2, 3, 4, 5] as const;
export const crearCitaMedicaEsquema = z.object({
  medico: z
    .string()
    .min(1, 'El médico debe tener identificador profesional')
    .min(5, 'El documento profesional del médico debe tener mínimo 5 caracteres')
    .max(15, 'El documento profesional del médico debe tener máximo 15 caracteres')
    .regex(/^[A-Za-z0-9]+$/, 'El ID del médico solo debe contener letras y números'),

  tipoDocPaciente: z
    .number()
    .int('El tipo de documento debe ser un número entero')
    .min(1, 'El tipo de documento debe estar entre 1 y 4')
    .max(4, 'El tipo de documento debe estar entre 1 y 4'),

  numeroDocPaciente: z
    .string()
    .min(1, 'El paciente debe tener un número de identificación')
    .min(6, 'El documento de identidad del paciente debe tener mínimo 6 caracteres')
    .max(15, 'El documento de identidad del paciente debe tener máximo 15 caracteres')
    .regex(/^[A-Za-z0-9]+$/, 'El documento solo debe contener letras y números'),

  fecha: z
    .string()
    .nonempty('La hora de inicio es obligatoria')
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      'La fecha debe estar en formato YYYY-MM-DD (ej. 2025-11-04)'
    ),

  horaInicio: z
    .string()
    .min(1, 'La hora de inicio es obligatoria')
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
      'La hora debe estar en formato HH:MM o HH:MM:SS')
});

export type citaMedicaDTO = z.infer<typeof crearCitaMedicaEsquema>;