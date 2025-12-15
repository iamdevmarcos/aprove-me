import { z } from "zod"

export const createPayableSchema = z.object({
  value: z.number().positive("Valor deve ser maior que zero"),
  emissionDate: z.string().min(1, "Data de emissão é obrigatória"),
  assignorId: z.string().uuid("Cedente deve ser um UUID válido"),
})

export type CreatePayableFormData = z.infer<typeof createPayableSchema>

export const updatePayableSchema = createPayableSchema.partial()

export type UpdatePayableFormData = z.infer<typeof updatePayableSchema>

