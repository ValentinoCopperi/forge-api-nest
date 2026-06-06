import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  AUTH_NAME_MAX_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
} from '@/modules/auth/constants';

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Jane Doe',
    minLength: 1,
    maxLength: AUTH_NAME_MAX_LENGTH,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1, { message: 'El nombre es obligatorio' })
  @MaxLength(AUTH_NAME_MAX_LENGTH, {
    message: `El nombre no puede superar los ${AUTH_NAME_MAX_LENGTH} caracteres`,
  })
  name: string;

  @ApiProperty({
    description: 'Unique email address',
    example: 'jane.doe@company.com',
    format: 'email',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({
    description: 'Plain-text password (stored as passwordHash server-side)',
    example: 'Str0ngP@ssw0rd',
    minLength: AUTH_PASSWORD_MIN_LENGTH,
    maxLength: AUTH_PASSWORD_MAX_LENGTH,
    format: 'password',
  })
  @IsString()
  @MinLength(AUTH_PASSWORD_MIN_LENGTH, {
    message: `La contraseña debe tener al menos ${AUTH_PASSWORD_MIN_LENGTH} caracteres`,
  })
  @MaxLength(AUTH_PASSWORD_MAX_LENGTH, {
    message: `La contraseña no puede superar los ${AUTH_PASSWORD_MAX_LENGTH} caracteres`,
  })
  password: string;
}
