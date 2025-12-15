import { Button } from "@/src/components/ui/button"
import { FormInput } from "@/src/components/ui/form-input"
import { FormSelect } from "@/src/components/ui/form-select"
import { CopyButton } from "@/src/components/ui/copy-button"
import type { Assignor } from "@/src/features/assignors/types"

interface PayableFormUIProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  register: any
  errors: any
  assignors: Assignor[]
  isSubmitting: boolean
}

export function PayableFormUI({
  onSubmit,
  register,
  errors,
  assignors,
  isSubmitting,
}: PayableFormUIProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" htmlFor="id">
            ID (UUID)
          </label>
          <CopyButton
            size="sm"
            variant="ghost"
            content={undefined}
            aria-label="Copiar UUID gerado"
            onCopy={() => false}
          />
        </div>
        <FormInput
          label=""
          name="id"
          type="text"
          placeholder="550e8400-e29b-41d4-a716-446655440000"
          register={register("id")}
          error={errors.id}
          spacing="sm"
        />
      </div>

      <FormInput
        label="Valor"
        name="value"
        type="number"
        step="0.01"
        placeholder="1000.00"
        register={register("value", { valueAsNumber: true })}
        error={errors.value}
        spacing="sm"
      />

      <FormInput
        label="Data de Emissão"
        name="emissionDate"
        type="date"
        register={register("emissionDate")}
        error={errors.emissionDate}
        spacing="sm"
      />

      <FormSelect
        label="Cedente"
        name="assignorId"
        register={register("assignorId")}
        error={errors.assignorId}
        spacing="sm"
      >
        <option value="">Selecione um cedente</option>
        {assignors.map((assignor) => (
          <option key={assignor.id} value={assignor.id}>
            {assignor.name} - {assignor.document}
          </option>
        ))}
      </FormSelect>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Cadastrando..." : "Cadastrar Recebível"}
      </Button>
    </form>
  )
}

