import { z } from 'zod';

export const CrearPacienteEsquema = z.object({
  nombre: z
    .string()
    .nonempty('El nombre del paciente es obligatorio')
    .min(3, 'El nombre debe tener al menos 2 caracteres.'),

  apellidos: z
    .string()
    .nonempty('Los apelidos del paciente son obligatorios (Al menos uno)')
    .min(2, 'Los apellidos deben tener al menos 2 caracteres.'),

  fecha_nacimiento: z
    .string()
    .nonempty('La fecha de naciemiento del paciente es obligatoria')
    .pipe(z.coerce.date()),

  sexo: z.enum(['M', 'F'], {
    message: "El sexo debe ser 'M', 'F' u 'Otro'.",
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

export type PacienteDTO = z.infer<typeof CrearPacienteEsquema>;
