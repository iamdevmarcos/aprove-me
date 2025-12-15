"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAssignors } from "@/src/features/assignors/hooks/use-assignors"
import { useUpdatePayable } from "../hooks/use-payables"
import { updatePayableSchema } from "../types/schemas"
import type { UpdatePayableFormData } from "../types/schemas"
import type { Payable } from "../types"
import { FormDrawer } from "@/src/components/ui/form-drawer"
import { Button } from "@/src/components/ui/button"
import { FormSelect } from "@/src/components/ui/form-select"
import { DatePicker } from "@/src/components/ui/date-picker"
import { Label } from "@/src/components/ui/label"
import Mask from "@/src/hooks/masks"
import { setBackendErrors } from "@/src/helpers/utils"
import { Input } from "@/src/components/ui/input"

interface EditPayableDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payable: Payable | null
}

export function EditPayableDrawer({
  open,
  onOpenChange,
  payable,
}: EditPayableDrawerProps) {
  const { data: assignors = [] } = useAssignors()
  const updatePayable = useUpdatePayable()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
    setError,
  } = useForm<UpdatePayableFormData>({
    resolver: zodResolver(updatePayableSchema),
    mode: "onChange",
  })

  useEffect(() => {
    if (payable) {
      const emissionDate = new Date(payable.emissionDate)
        .toISOString()
        .slice(0, 10)

      reset({
        value: payable.value,
        emissionDate,
        assignorId: payable.assignor.id,
      })
    }
  }, [payable, reset])

  const onSubmit = async (data: UpdatePayableFormData) => {
    if (!payable) return

    try {
      const payload = {
        ...data,
        value:
          typeof data.value === "number"
            ? data.value
            : parseFloat(Mask.removeMoneyInput(String(data.value ?? ""))),
      }

      await updatePayable.mutateAsync({
        id: payable.id,
        payload,
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
      title="Editar Recebível"
      description="Atualize os dados do recebível abaixo"
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
                  field.value !== undefined
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
            <p className="text-sm text-destructive">{errors.value.message}</p>
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

        <div className="flex flex-col gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
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
