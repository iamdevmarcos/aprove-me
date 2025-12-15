import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class CreateAssignorDto {
  @IsString({ message: 'document must be a string' })
  @IsNotEmpty({ message: 'document is required' })
  @MinLength(11, { message: 'document must have at least 11 characters' })
  @MaxLength(14, { message: 'document must not exceed 14 characters' })
  document: string;

  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email' })
  @MaxLength(140, { message: 'email must not exceed 140 characters' })
  email: string;

  @IsString({ message: 'phone must be a string' })
  @IsNotEmpty({ message: 'phone is required' })
  @MinLength(10, { message: 'phone must have at least 10 characters' })
  @MaxLength(20, { message: 'phone must not exceed 20 characters' })
  phone: string;

  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  @MinLength(2, { message: 'name must have at least 2 characters' })
  @MaxLength(140, { message: 'name must not exceed 140 characters' })
  name: string;
}
