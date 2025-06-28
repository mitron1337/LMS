import { IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResultDto {
  @ApiProperty({ example: 1, description: 'ID студента' })
  @IsNumber()
  studentId: number;

  @ApiProperty({ example: 1, description: 'ID курса' })
  @IsNumber()
  courseId: number;

  @ApiProperty({ example: 85, description: 'Балл за курс' })
  @IsNumber()
  score: number;

  @ApiProperty({ example: 85.5, description: 'Процент выполнения' })
  @IsNumber()
  percentage: number;

  @ApiProperty({ example: true, description: 'Прошел ли курс' })
  @IsBoolean()
  isPassed: boolean;
}

export class UpdateResultDto {
  @ApiProperty({ example: 85, description: 'Балл за курс', required: false })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiProperty({
    example: 85.5,
    description: 'Процент выполнения',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  percentage?: number;

  @ApiProperty({
    example: true,
    description: 'Прошел ли курс',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPassed?: boolean;
}
