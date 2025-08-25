import { Length, Min, IsInt, IsOptional, IsEmail } from 'class-validator';

export class CreateProfileDto {
  @IsEmail()
  email!: string;

  @Length(2, 20)
  displayName!: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;
}
