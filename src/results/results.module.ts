import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { Result } from './result.entity';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { Assignment } from '../assignments/assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Result, User, Course, Assignment])],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}
