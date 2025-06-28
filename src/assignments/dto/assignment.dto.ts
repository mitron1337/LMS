import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({
    example: 'Решить задачу по математике',
    description: 'Название задания',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Решите квадратное уравнение x² + 5x + 6 = 0',
    description: 'Описание задания',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 1, description: 'ID модуля' })
  @IsNumber()
  moduleId: number;

  @ApiProperty({
    example: 'https://example.com/file.pdf',
    description: 'Ссылка на файл (опционально)',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;
}

export class UpdateAssignmentDto {
  @ApiProperty({
    example: 'Решить задачу по математике',
    description: 'Название задания',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Решите квадратное уравнение x² + 5x + 6 = 0',
    description: 'Описание задания',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/file.pdf',
    description: 'Ссылка на файл (опционально)',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;
}

export class SubmitAssignmentDto {
  @ApiProperty({
    example: 'My solution to the problem...',
    description: 'Содержание задания',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'https://example.com/file.pdf',
    description: 'Ссылка на файл (опционально)',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiProperty({ example: 1, description: 'ID модуля' })
  @IsNumber()
  moduleId: number;
}

export class GradeAssignmentDto {
  @ApiProperty({ example: 85, description: 'Оценка за задание (0-100)' })
  @IsNumber()
  grade: number;
}
