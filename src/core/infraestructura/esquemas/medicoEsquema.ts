import { z } from 'zod';

export const crearMedicoEsquema = z.object({
    tarjetaProfesional: z
    .string()
    .min(3, { message: "La tarjeta profesional debe tener al menos 3 caracteres" })
    .max(50, { message: "La tarjeta profesional no puede superar los 50 caracteres" }),
    
    tipoDoc: z
    .number({ message: "El tipo de documento es obligatorio" })
    .int()
    .positive({ message: "El tipo de documento debe ser un número positivo" }),

  numeroDoc: z
    .string()
    .min(5, { message: "El número de documento debe tener al menos 5 caracteres" })
    .max(20, { message: "El número de documento no puede superar los 20 caracteres" }),

  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede superar los 50 caracteres" }),

  apellido: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no puede superar los 50 caracteres" }),

  fechaNacimiento: z
    .string()
    .refine(
      (value) => !isNaN(Date.parse(value)),
      { message: "La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)" }
    ),

  sexo: z
    .string()
    .min(1, { message: "El sexo es obligatorio" })
    .max(1, { message: "El sexo debe ser un solo carácter (M/F/O)" })
    .refine(
      (value) => ["M", "F", "O"].includes(value.toUpperCase()),
      { message: "El sexo debe ser 'M', 'F' o 'O'" }
    ),

  especialidad: z
    .string()
    .min(3, { message: "La especialidad debe tener al menos 3 caracteres" })
    .max(100, { message: "La especialidad no puede superar los 100 caracteres" }),

  email: z
    .email({ message: "El correo electrónico no es válido" }),

  telefono: z
    .string()
    .regex(/^[0-9]{7,10}$/, { message: "El teléfono debe tener entre 7 y 10 dígitos" }),
});


export type MedicoDTO = z.infer<typeof crearMedicoEsquema>;
export type MedicoActualizarDTO = Partial<MedicoDTO>;


