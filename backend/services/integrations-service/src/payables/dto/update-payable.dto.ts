import {
  IsString,
  IsUUID,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class UpdatePayableDto {
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'id must be a valid UUID' })
  id?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsDateString()
  emissionDate?: string;

  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'assignorId must be a valid UUID' })
  assignorId?: string;
}
