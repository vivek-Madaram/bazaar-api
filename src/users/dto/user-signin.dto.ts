import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserSignInDto {
  @IsNotEmpty({ message: 'email cannot be empty' })
  @IsEmail({}, { message: 'please provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'password cannot be empty' })
  @MinLength(5, { message: 'password minimum charector should be 5' })
  password: string;
}
