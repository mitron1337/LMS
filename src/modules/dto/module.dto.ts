import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({
    example: 'Introduction to JavaScript',
    description: 'Название модуля',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Learn the basics of JavaScript programming',
    description: 'Описание модуля',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 1, description: 'Порядковый номер модуля' })
  @IsNumber()
  order: number;

  @ApiProperty({ example: 1, description: 'ID курса' })
  @IsNumber()
  courseId: number;
}

export class UpdateModuleDto {
  @ApiProperty({
    example: 'Introduction to JavaScript',
    description: 'Название модуля',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Learn the basics of JavaScript programming',
    description: 'Описание модуля',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'Порядковый номер модуля',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}
