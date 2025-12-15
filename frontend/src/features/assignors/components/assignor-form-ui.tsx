import { Button } from "@/src/components/ui/button"
import { FormInput } from "@/src/components/ui/form-input"
import { CopyButton } from "@/src/components/ui/copy-button"

interface AssignorFormUIProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  register: any
  errors: any
  isSubmitting: boolean
}

export function AssignorFormUI({
  onSubmit,
  register,
  errors,
  isSubmitting,
}: AssignorFormUIProps) {
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
        label="Nome / Razão Social"
        name="name"
        type="text"
        placeholder="Nome ou razão social"
        maxLength={140}
        register={register("name")}
        error={errors.name}
        spacing="sm"
      />

      <FormInput
        label="CPF / CNPJ"
        name="document"
        type="text"
        placeholder="12345678901"
        maxLength={30}
        register={register("document")}
        error={errors.document}
        spacing="sm"
      />

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

      <FormInput
        label="Telefone"
        name="phone"
        type="text"
        placeholder="11999999999"
        maxLength={20}
        register={register("phone")}
        error={errors.phone}
        spacing="sm"
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Cadastrando..." : "Cadastrar Cedente"}
      </Button>
    </form>
  )
}

