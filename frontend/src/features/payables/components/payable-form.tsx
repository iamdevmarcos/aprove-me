"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreatePayable } from "../hooks/use-payables"
import { useAssignors } from "@/src/features/assignors/hooks/use-assignors"
import { createPayableSchema } from "../types/schemas"
import type { CreatePayableFormData } from "../types/schemas"
import { PayableFormUI } from "./payable-form-ui"
import { useRouter } from "next/navigation"

export function PayableForm() {
  const router = useRouter()
  const { data: assignors = [] } = useAssignors()
  const createPayable = useCreatePayable()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePayableFormData>({
    resolver: zodResolver(createPayableSchema),
  })

  const onSubmit = async (data: CreatePayableFormData) => {
    try {
      const result = await createPayable.mutateAsync(data)
      router.push(`/dashboard/payables/${result.id}`)
    } catch (error) {
      console.error("Erro ao cadastrar recebível:", error)
    }
  }

  return (
    <PayableFormUI
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      errors={errors}
      assignors={assignors}
      isSubmitting={isSubmitting}
    />
  )
}

