import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCoursesController } from './student-courses.controller';
import { StudentCoursesService } from './student-courses.service';
import { StudentCourse } from './student-course.entity';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentCourse, User, Course])],
  controllers: [StudentCoursesController],
  providers: [StudentCoursesService],
  exports: [StudentCoursesService],
})
export class StudentCoursesModule {}
