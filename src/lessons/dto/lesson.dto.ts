import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({
    example: 'Variables and Data Types',
    description: 'Название урока',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'In this lesson, we will learn about variables...',
    description: 'Содержание урока',
  })
  @IsString()
  content: string;

  @ApiProperty({ example: 1, description: 'Порядковый номер урока' })
  @IsNumber()
  order: number;

  @ApiProperty({ example: 45, description: 'Длительность урока в минутах' })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: 1, description: 'ID модуля' })
  @IsNumber()
  moduleId: number;

  @ApiProperty({
    example: 2,
    description: 'ID учителя (опционально)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  teacherUserId?: number;
}

export class UpdateLessonDto {
  @ApiProperty({
    example: 'Variables and Data Types',
    description: 'Название урока',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'In this lesson, we will learn about variables...',
    description: 'Содержание урока',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    example: 1,
    description: 'Порядковый номер урока',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    example: 45,
    description: 'Длительность урока в минутах',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ example: 2, description: 'ID учителя', required: false })
  @IsOptional()
  @IsNumber()
  teacherUserId?: number;
}
