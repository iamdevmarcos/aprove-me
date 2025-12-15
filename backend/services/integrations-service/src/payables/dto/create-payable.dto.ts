import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreatePayableDto {
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsDateString()
  @IsNotEmpty()
  emissionDate: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'assignorId must be a valid UUID' })
  assignorId: string;
}
