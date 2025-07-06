import { ApiProperty } from '@nestjs/swagger';
import { Length, Min, Max, IsInt, IsOptional } from 'class-validator';

export class CreateTeaDto {
  @ApiProperty({ example: 'Green Tea' })
  @Length(3, 40)
  name!: string;

  @ApiProperty({ example: 'Ceylon' })
  @Length(2, 20)
  origin!: string;

  @ApiProperty({ example: '4' })
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: '80' })
  @IsInt()
  @Min(60)
  @Max(100)
  @IsOptional()
  brewTemp?: number;

  @ApiProperty({ example: 'It has reach taste' })
  @Length(0, 150)
  @IsOptional()
  notes?: string;
}
