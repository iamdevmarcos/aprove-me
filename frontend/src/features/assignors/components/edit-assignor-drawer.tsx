"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateAssignor } from "../hooks/use-assignors"
import { createAssignorSchema } from "../types/schemas"
import type { CreateAssignorFormData } from "../types/schemas"
import type { Assignor } from "../types"
import Mask from "@/src/hooks/masks"
import { FormDrawer } from "@/src/components/ui/form-drawer"
import { Button } from "@/src/components/ui/button"
import { FormInput } from "@/src/components/ui/form-input"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useEffect } from "react"
import { setBackendErrors } from "@/src/helpers/utils"

interface EditAssignorDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignor: Assignor | null
}

export function EditAssignorDrawer({
  open,
  onOpenChange,
  assignor,
}: EditAssignorDrawerProps) {
  const updateAssignor = useUpdateAssignor()

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<CreateAssignorFormData>({
    resolver: zodResolver(createAssignorSchema),
    mode: "onChange",
  })

  useEffect(() => {
    if (assignor) {
      const documentFormatted =
        assignor.document.length <= 11
          ? Mask.CPF(assignor.document)
          : Mask.CNPJ(assignor.document)
          
      reset({
        name: assignor.name,
        document: documentFormatted,
        email: assignor.email,
        phone: Mask.phone(assignor.phone),
      })
    }
  }, [assignor, reset])

  const onSubmit = async (data: CreateAssignorFormData) => {
    if (!assignor) return

    try {
      const unmaskedData = {
        ...data,
        document:
          data.document.length <= 14
            ? Mask.removeMaskCpf(data.document)
            : Mask.removeMaskCnpj(data.document),
        phone: data.phone.replace(/\D/g, ""),
      }
      await updateAssignor.mutateAsync({
        id: assignor.id,
        payload: unmaskedData,
      })
      reset()
      onOpenChange(false)
    } catch (error) {
      setBackendErrors(error, setError)
    }
  }

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Cedente"
      description="Atualize os dados do cedente abaixo"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Nome / Razão Social"
          name="name"
          type="text"
          placeholder="Nome ou razão social"
          maxLength={140}
          register={register("name")}
          error={errors.name}
          spacing="sm"
        />

        <div className="space-y-2">
          <Label htmlFor="document">CPF / CNPJ</Label>
          <Controller
            name="document"
            control={control}
            render={({ field }) => (
              <Input
                id="document"
                type="text"
                value={field.value || ""}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "")
                  const maskedValue =
                    rawValue.length <= 11
                      ? Mask.CPF(e.target.value)
                      : Mask.CNPJ(e.target.value)
                  field.onChange(maskedValue)
                }}
                placeholder="Digite o CPF ou CNPJ"
                maxLength={18}
              />
            )}
          />
          {errors.document && (
            <p className="text-sm text-destructive">
              {errors.document.message}
            </p>
          )}
        </div>

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="email@example.com"
          maxLength={140}
          register={register("email")}
          error={errors.email}
          spacing="sm"
        />

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                id="phone"
                type="text"
                value={field.value || ""}
                onChange={(e) => {
                  const maskedValue = Mask.phone(e.target.value)
                  field.onChange(maskedValue)
                }}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            )}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </FormDrawer>
  )
}
