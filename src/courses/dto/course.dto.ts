import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CourseLevel } from '../course.entity';

export class CreateCourseDto {
  @ApiProperty({
    example: 'JavaScript Fundamentals',
    description: 'Название курса',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Learn JavaScript from scratch',
    description: 'Описание курса',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 99.99, description: 'Цена курса' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'John Smith', description: 'Имя преподавателя' })
  @IsString()
  teacher: string;

  @ApiProperty({ example: 'Programming', description: 'Категория курса' })
  @IsString()
  category: string;

  @ApiProperty({
    enum: CourseLevel,
    example: CourseLevel.BEGINNER,
    description: 'Уровень сложности',
  })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({
    example: 1,
    description: 'ID учителя (опционально)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  teacherUserId?: number;
}

export class UpdateCourseDto {
  @ApiProperty({
    example: 'JavaScript Fundamentals',
    description: 'Название курса',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Learn JavaScript from scratch',
    description: 'Описание курса',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 99.99, description: 'Цена курса', required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: 'John Smith',
    description: 'Имя преподавателя',
    required: false,
  })
  @IsOptional()
  @IsString()
  teacher?: string;

  @ApiProperty({
    example: 'Programming',
    description: 'Категория курса',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    enum: CourseLevel,
    example: CourseLevel.BEGINNER,
    description: 'Уровень сложности',
    required: false,
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiProperty({ example: 1, description: 'ID учителя', required: false })
  @IsOptional()
  @IsNumber()
  teacherUserId?: number;
}
