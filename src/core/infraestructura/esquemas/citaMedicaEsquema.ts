import { z } from 'zod';
const estadosValidos = [1, 2, 3, 4, 5] as const;
export const crearCitaMedicaEsquema = z.object({
  medico: z
    .string()
    .nonempty('El médico debe tener identificador profesional')
    .min(5, 'El documento profesional del médico debe tener mínimo 6 carateres')
    .max(15, 'El documento profesional del médico debe tener máximo 15 carateres')
    .regex(/^[A-Za-z0-9]+$/, 'El ID del médico solo debe contener letras y números'),

  tipoDocPaciente: z
    .number()
    .int('El documento de identidad debe ser un etero')
    .nonnegative('El documento de identidad debe ser un número positivo')
    .min(1, 'El tipo de documento debe ser un número entre 1 y 4')
    .max(4, 'El tipo de documento debe ser un número entre 1 y 4'),

  numeroDocPaciente: z
    .string()
    .nonempty('El paciente debe tener un numero de identificación')
    .min(6, 'El documento de identidad del paciente debe tener mínimo 6 carateres')
    .max(15, 'El documento de identidad del paciente debe tener máximo 15 carateres')
    .regex(/^[A-Za-z0-9]+$/, 'El ID del médico solo debe contener letras y números'),

  fecha: z
    .string()
    .nonempty('La fecha es obligatoria')
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      'La fecha debe estar en formato YYYY-MM-DD (ej. 2025-11-04)'
    ),

  horaInicio: z
    .string()
    .nonempty('La hora de inicio es obligatoria')
    .regex(/^[0-9:]+$/, 'La hora debe estar en formato HH:MM (ej. 14:00)')
    .length(5, 'El formato de hora debe ser exactamente HH:MM (5 caracteres)'),
});

export type citaMedicaDTO = z.infer<typeof crearCitaMedicaEsquema>;
