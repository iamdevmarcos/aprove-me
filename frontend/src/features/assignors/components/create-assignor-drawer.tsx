"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateAssignor } from "../hooks/use-assignors"
import { createAssignorSchema } from "../types/schemas"
import type { CreateAssignorFormData } from "../types/schemas"
import Mask from "@/src/hooks/masks"
import { FormDrawer } from "@/src/components/ui/form-drawer"
import { Button } from "@/src/components/ui/button"
import { FormInput } from "@/src/components/ui/form-input"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { setBackendErrors } from "@/src/helpers/utils"
import { toast } from "sonner"

interface CreateAssignorDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAssignorDrawer({
  open,
  onOpenChange,
}: CreateAssignorDrawerProps) {
  const createAssignor = useCreateAssignor()

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

  const onSubmit = async (data: CreateAssignorFormData) => {
    try {
      const unmaskedData = {
        ...data,
        document: data.document.length <= 14 
          ? Mask.removeMaskCpf(data.document)
          : Mask.removeMaskCnpj(data.document),
        phone: data.phone.replace(/\D/g, ""),
      }
      await createAssignor.mutateAsync(unmaskedData)
      reset()
      onOpenChange(false)
      toast.success("Cedente cadastrado com sucesso!")
    } catch (error) {
      setBackendErrors(error, setError)
    }
  }

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Cadastrar Cedente"
      description="Preencha os dados do cedente abaixo"
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
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
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

