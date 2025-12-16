"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreatePayable } from "../hooks/use-payables"
import { useAssignors } from "@/src/features/assignors/hooks/use-assignors"
import { createPayableSchema } from "../types/schemas"
import type { CreatePayableFormData } from "../types/schemas"
import Mask from "@/src/hooks/masks"
import { FormDrawer } from "@/src/components/ui/form-drawer"
import { Button } from "@/src/components/ui/button"
import { FormSelect } from "@/src/components/ui/form-select"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { DatePicker } from "@/src/components/ui/date-picker"
import Link from "next/link"
import { toast } from "sonner"

interface CreatePayableDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePayableDrawer({
  open,
  onOpenChange,
}: CreatePayableDrawerProps) {
  const { data: assignors = [] } = useAssignors()
  const createPayable = useCreatePayable()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<CreatePayableFormData>({
    resolver: zodResolver(createPayableSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: CreatePayableFormData) => {
    try {
      await createPayable.mutateAsync(data)
      reset()
      onOpenChange(false)
      toast.success("Recebível cadastrado com sucesso!")
    } catch (error) {
      console.error("Erro ao cadastrar recebível:", error)
    }
  }

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Cadastrar Recebível"
      description="Preencha os dados do recebível abaixo"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Controller
                name="value"
                control={control}
                render={({ field }) => (
                  <Input
                    id="value"
                    type="text"
                    value={
                      field.value
                        ? Mask.moneyInput(field.value.toString())
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = Mask.removeMoneyInput(e.target.value)
                      field.onChange(parseFloat(rawValue))
                    }}
                    placeholder="R$ 0,00"
                  />
                )}
              />
              {errors.value && (
                <p className="text-sm text-destructive">
                  {errors.value.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emissionDate">Data de Emissão</Label>
              <Controller
                name="emissionDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="emissionDate"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione a data de emissão"
                  />
                )}
              />
              {errors.emissionDate && (
                <p className="text-sm text-destructive">
                  {errors.emissionDate.message}
                </p>
              )}
            </div>

            <FormSelect
              label="Cedente"
              name="assignorId"
              register={register("assignorId")}
              error={errors.assignorId}
              disabled={assignors.length === 0}
              spacing="sm"
            >
              <option value="">Selecione um cedente</option>
              {assignors.map((assignor) => (
                <option key={assignor.id} value={assignor.id}>
                  {assignor.name} - {assignor.document}
                </option>
              ))}
            </FormSelect>

            <NoAssignorsMessage hasAssignors={assignors.length > 0} />

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

const NoAssignorsMessage = ({ hasAssignors }: { hasAssignors: boolean }) => (
  <>
    {!hasAssignors && (
      <p className="text-sm text-blue-600">
        Nenhum cedente cadastrado.{" "}
        <Link
          href="/dashboard/assignors"
          className="underline hover:text-blue-800"
        >
          Cadastre aqui
        </Link>
      </p>
    )}
  </>
);