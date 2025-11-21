import { z } from 'zod';

export const CrearConsultorioEsquema = z.object({
  idConsultorio: z
    .string()
    .nonempty('El ID del consultorio es obligatorio')
    .min(1, 'El ID debe tener al menos 1 carácter')
    .max(5, 'El ID no puede exceder 5 caracteres'),
  ubicacion: z
    .string()
    .optional()
    .transform((valor) => valor ?? null),
});

export type ConsultorioDTO = z.infer<typeof CrearConsultorioEsquema>;
