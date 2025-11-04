import { z } from "zod";

export const CrearConsultorioEsquema = z.object({
  idConsultorio: z
    .string()
    .nonempty("El ID del consultorio es obligatorio")
    .min(1, "El ID debe tener al menos 1 carácter")
    .max(5, "El ID no puede exceder 5 caracteres"),
  ubicacion: z
    .string()
    .optional()
    .transform((valor) => valor ?? null),
  estado: z
    .number()
    .int("El estado debe ser un número entero")
    .refine(
      (val) => val === 6 || val === 7,
      { message: "El estado debe ser 6 (Ocupado) o 7 (Disponible)" }
    ),
});

export type ConsultorioDTO = z.infer<typeof CrearConsultorioEsquema>;