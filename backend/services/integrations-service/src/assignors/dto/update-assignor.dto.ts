import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class UpdateAssignorDto {
  @IsOptional()
  @IsString({ message: 'document must be a string' })
  @MinLength(11, { message: 'document must have at least 11 characters' })
  @MaxLength(14, { message: 'document must not exceed 14 characters' })
  document?: string;

  @IsOptional()
  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'email must be a valid email' })
  @MaxLength(140, { message: 'email must not exceed 140 characters' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'phone must be a string' })
  @MinLength(10, { message: 'phone must have at least 10 characters' })
  @MaxLength(20, { message: 'phone must not exceed 20 characters' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'name must be a string' })
  @MinLength(2, { message: 'name must have at least 2 characters' })
  @MaxLength(140, { message: 'name must not exceed 140 characters' })
  name?: string;
}
