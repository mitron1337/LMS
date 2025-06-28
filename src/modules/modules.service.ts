import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './module.entity';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
  ) {}

  async create(
    createModuleDto: CreateModuleDto,
    userId?: number,
    userRole?: UserRole,
  ) {
    const module = this.moduleRepository.create(createModuleDto);
    return this.moduleRepository.save(module);
  }

  async findAll(courseId?: number, studentId?: number, userRole?: UserRole) {
    if (studentId) {
      return this.moduleRepository
        .createQueryBuilder('module')
        .leftJoin('module.course', 'course')
        .leftJoin('course.studentCourses', 'sc')
        .where('sc.studentId = :studentId', { studentId })
        .andWhere('module.courseId = :courseId', { courseId })
        .getMany();
    }

    if (courseId) {
      return this.moduleRepository.find({
        where: { courseId },
        relations: ['lessons'],
      });
    }

    return this.moduleRepository.find({
      relations: ['course', 'lessons'],
    });
  }

  async findOne(id: number, studentId?: number, userRole?: UserRole) {
    const module = await this.moduleRepository.findOne({
      where: { id },
      relations: ['course', 'lessons'],
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    if (studentId) {
      const hasAccess = await this.moduleRepository
        .createQueryBuilder('module')
        .leftJoin('module.course', 'course')
        .leftJoin('course.studentCourses', 'sc')
        .where('module.id = :moduleId', { moduleId: id })
        .andWhere('sc.studentId = :studentId', { studentId })
        .getOne();

      if (!hasAccess) {
        throw new ForbiddenException('Access denied');
      }
    }

    return module;
  }

  async update(
    id: number,
    updateModuleDto: UpdateModuleDto,
    userId?: number,
    userRole?: UserRole,
  ) {
    const module = await this.findOne(id);

    if (userRole === UserRole.TEACHER) {
      const course = await this.moduleRepository
        .createQueryBuilder('module')
        .leftJoin('module.course', 'course')
        .where('module.id = :moduleId', { moduleId: id })
        .andWhere('course.teacherUserId = :teacherId', { teacherId: userId })
        .getOne();

      if (!course) {
        throw new ForbiddenException('Access denied');
      }
    }

    Object.assign(module, updateModuleDto);
    return this.moduleRepository.save(module);
  }

  async remove(id: number, userId?: number, userRole?: UserRole) {
    const module = await this.findOne(id);

    if (userRole === UserRole.TEACHER) {
      const course = await this.moduleRepository
        .createQueryBuilder('module')
        .leftJoin('module.course', 'course')
        .where('module.id = :moduleId', { moduleId: id })
        .andWhere('course.teacherUserId = :teacherId', { teacherId: userId })
        .getOne();

      if (!course) {
        throw new ForbiddenException('Access denied');
      }
    }

    return this.moduleRepository.remove(module);
  }
}
