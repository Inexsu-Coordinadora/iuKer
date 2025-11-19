import { z } from 'zod';

export const pacienteEsquema = z.object({
  numeroDoc: z.string('El documento debe ser un string'),
  tipoDoc: z.number('El tipo es 1, 2, 3 o 4'),
  nombre: z
    .string()
    .nonempty('El nombre del paciente es obligatorio')
    .min(3, 'El nombre debe tener al menos 2 caracteres.'),

  apellido: z
    .string()
    .nonempty('Los apellidos del paciente son obligatorios (Al menos uno)')
    .min(2, 'Los apellidos deben tener al menos 2 caracteres.'),

  fechaNacimiento: z
    .string()
    .nonempty('La fecha de nacimiento del paciente es obligatoria')
    .pipe(z.coerce.date()),

  sexo: z.enum(['M', 'F'], {
    message: "El sexo debe ser 'M', 'F'.",
  }),

  email: z.email('Formato de email inválido.'),

  telefono: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos.')
    .nonempty('El teléfono del paciente es obligatorio'),

  direccion: z
    .string()
    .min(8, 'La dirección es demasiado corta.')
    .nonempty('La dirección del paciente es obligatoria'),
});

export type PacienteDTO = z.infer<typeof pacienteEsquema>;
