import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';
import { StudentCoursesModule } from '../student-courses/student-courses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), StudentCoursesModule],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
