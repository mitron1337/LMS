import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentCourseDto {
  @ApiProperty({ example: 1, description: 'ID студента' })
  @IsNumber()
  studentId: number;

  @ApiProperty({ example: 1, description: 'ID курса' })
  @IsNumber()
  courseId: number;
}

export class EnrollCourseDto {
  @ApiProperty({ example: 1, description: 'ID курса для записи' })
  @IsNumber()
  courseId: number;
}
