import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  age: number;

  @IsString()
  gender: string;

  @IsBoolean()
  hasProblems: boolean;
}
