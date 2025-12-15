"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateAssignor } from "../hooks/use-assignors"
import { createAssignorSchema } from "../types/schemas"
import type { CreateAssignorFormData } from "../types/schemas"
import { AssignorFormUI } from "./assignor-form-ui"
import { useRouter } from "next/navigation"
import { setBackendErrors } from "@/src/helpers/utils"

export function AssignorForm() {
  const router = useRouter()
  const createAssignor = useCreateAssignor()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAssignorFormData>({
    resolver: zodResolver(createAssignorSchema),
  })

  const onSubmit = async (data: CreateAssignorFormData) => {
    try {
      const result = await createAssignor.mutateAsync(data)
      router.push(`/dashboard/assignors/${result.id}`)
    } catch (error) {
      setBackendErrors(error, setError)
    }
  }

  return (
    <AssignorFormUI
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
    />
  )
}

