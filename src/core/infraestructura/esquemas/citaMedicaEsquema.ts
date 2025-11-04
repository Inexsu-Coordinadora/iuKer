import { z } from 'zod';

export const crearCitaMedicaEsquema = z.object({
  idCita: z
    .string()
    .nonempty('La cita debe tener un id')
    .min(6, 'La cita debe tener un id de mínimo 6 carateres')
    .max(50, 'La cita debe tener un id der máximo 50 caráteres')
    .regex(/^[A-Za-z0-9]+$/, 'El ID de la cita solo debe contener letras y números'),

  medico: z
    .string()
    .nonempty('El médico debe tener identificador profesional')
    .min(5, 'El documento profesional del médico debe tener mínimo 6 carateres')
    .max(15, 'El documento profesional del médico debe tener máximo 15 caráteres')
    .regex(/^[A-Za-z0-9]+$/, 'El ID del médico solo debe contener letras y números'),

  tipoDocPaciente: z
    .number()
    .int('El documento de identidad debe ser un etero')
    .nonnegative('El documento de identidad debe ser un número positivo')
    .max(1, 'El documento de identidad debe tener máximo 15 caráteres'),

  numeroDocPaciente: z
    .string()
    .nonempty('El paciente debe tener un numero de identificación')
    .min(6, 'El documento de identidad del paciente debe tener mínimo 6 carateres')
    .max(15, 'El documento de identidad del paciente debe tener máximo 15 carateres')
    .regex(/^[A-Za-z0-9]+$/, 'El ID del médico solo debe contener letras y números'),

  idConsultorio: z
    .string()
    .nonempty('Se sebe seleccionar el consultorio')
    .length(4, ' El id del consultorio debe ser de 4 carateres')
    .regex(/^[A-Za-z0-9]+$/, 'El consultorio solo debe contener letras y números'),

  fecha: z
    .string()
    .nonempty('La hora de inicio es obligatoria')
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      'La fecha debe estar en formato YYYY-MM-DD (ej. 2025-11-04)'
    ),
  /* .regex(/^[0-9:]+$/, 'La hora debe estar en formato HH:MM (ej. 14:00)')
    .length(5, 'El formato de hora debe ser exactamente HH:MM (5 caracteres)') */

  horaInicio: z
    .string()
    .nonempty('La hora de inicio es obligatoria')
    .regex(/^[0-9:]+$/, 'La hora debe estar en formato HH:MM (ej. 14:00)')
    .length(5, 'El formato de hora debe ser exactamente HH:MM (5 caracteres)'),

  duracion: z
    .string()
    .nonempty('Debes especificar la duración como "X minutos"')
    .min(9, 'La duración debe tener mínimo 9 carateres')
    .max(11, 'La duración debe tener máximo 11 carateres')
    .regex(/^[A-Za-z0-9\s]+$/, 'La duración debe contener letras y números'),

  estado: z
    .number()
    .int('El documento de identidad debe ser un etero')
    .nonnegative('El documento de identidad debe ser un número positivo'),
  //.max(5, 'El documento de identidad debe tener máximo 15 caráteres'),
});

export type citaMedicaDTO = z.infer<typeof crearCitaMedicaEsquema>;
