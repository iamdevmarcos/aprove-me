import type { Assignor } from "@/src/features/assignors/types"

export interface Payable {
  id: string
  value: number
  emissionDate: string
  assignor: Assignor
}

export interface CreatePayableDto {
  value: number
  emissionDate: string
  assignorId: string
}

export interface UpdatePayableDto extends Partial<CreatePayableDto> {}

