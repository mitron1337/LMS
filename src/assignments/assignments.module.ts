import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';
import { User } from '../users/user.entity';
import { Module as ModuleEntity } from '../modules/module.entity';
import { StudentCoursesModule } from '../student-courses/student-courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, User, ModuleEntity]),
    StudentCoursesModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
