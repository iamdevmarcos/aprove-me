import { z } from "zod"

const DOCUMENT_CPF_LENGTH = 11
const DOCUMENT_CNPJ_LENGTH = 14
const EMAIL_MAX_LENGTH = 140
const PHONE_MIN_LENGTH = 10
const PHONE_MAX_LENGTH = 20
const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 140

export const createAssignorSchema = z.object({
  document: z
    .string()
    .min(1, "Documento é obrigatório")
    .refine(
      (value) => {
        const digitsOnly = value.replace(/\D/g, "")
        return (
          digitsOnly.length === DOCUMENT_CPF_LENGTH ||
          digitsOnly.length === DOCUMENT_CNPJ_LENGTH
        )
      },
      {
        message: `Documento deve ter ${DOCUMENT_CPF_LENGTH} dígitos (CPF) ou ${DOCUMENT_CNPJ_LENGTH} dígitos (CNPJ)`,
      }
    ),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(EMAIL_MAX_LENGTH, `Email deve ter no máximo ${EMAIL_MAX_LENGTH} caracteres`),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .min(PHONE_MIN_LENGTH, `Telefone deve ter no mínimo ${PHONE_MIN_LENGTH} caracteres`)
    .max(PHONE_MAX_LENGTH, `Telefone deve ter no máximo ${PHONE_MAX_LENGTH} caracteres`),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(NAME_MIN_LENGTH, `Nome deve ter no mínimo ${NAME_MIN_LENGTH} caracteres`)
    .max(NAME_MAX_LENGTH, `Nome deve ter no máximo ${NAME_MAX_LENGTH} caracteres`),
})

export type CreateAssignorFormData = z.infer<typeof createAssignorSchema>

