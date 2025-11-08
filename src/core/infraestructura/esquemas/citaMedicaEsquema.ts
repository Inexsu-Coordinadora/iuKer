import { z } from 'zod';

const estadosValidos = [1, 2, 3, 4, 5] as const;

export const crearCitaMedicaEsquema = z.object({
  /* idCita: z
    .string()
    .nonempty('La cita debe tener un id')
    .min(6, 'La cita debe tener un id de mínimo 6 carateres')
    .max(50, 'La cita debe tener un id der máximo 50 caráteres')
    .regex(/^[A-Za-z0-9]+$/, 'El ID de la cita solo debe contener letras y números'), */

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

  fecha: z.coerce.date().refine((fecha) => fecha > new Date(), {
    message: 'La fecha de la cita debe ser futura',
  }),

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

  /* estado: z
    .number()
    .int('El estado debe ser un número entero')
    .refine((val) => val === 1 || val === 2 || val === 3 || val === 4 || val === 5, {
      message: 'El estado debe ser 6 (Ocupado) o 7 (Disponible)',
    }), */
});

export type citaMedicaDTO = z.infer<typeof crearCitaMedicaEsquema>;
