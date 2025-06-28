import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module as ModuleEntity } from './module.entity';
import { StudentCoursesModule } from '../student-courses/student-courses.module';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity]), StudentCoursesModule],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
