export interface Assignor {
  id: string
  document: string
  email: string
  phone: string
  name: string
}

export interface CreateAssignorDto {
  document: string
  email: string
  phone: string
  name: string
}

export interface UpdateAssignorDto extends Partial<CreateAssignorDto> {}

