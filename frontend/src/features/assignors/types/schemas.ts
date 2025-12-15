import { z } from "zod"

export const createAssignorSchema = z.object({
  document: z
    .string()
    .min(1, "Documento é obrigatório")
    .refine(
      (value) => {
        // Remove máscara para validar apenas os dígitos
        const digitsOnly = value.replace(/\D/g, "")
        // CPF tem 11 dígitos, CNPJ tem 14 dígitos
        return digitsOnly.length === 11 || digitsOnly.length === 14
      },
      {
        message: "Documento deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)",
      }
    ),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(140, "Email deve ter no máximo 140 caracteres"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .min(10, "Telefone deve ter no mínimo 10 caracteres")
    .max(20, "Telefone deve ter no máximo 20 caracteres"),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(140, "Nome deve ter no máximo 140 caracteres"),
})

export type CreateAssignorFormData = z.infer<typeof createAssignorSchema>

