import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async create(
    createLessonDto: CreateLessonDto,
    userId?: number,
    userRole?: UserRole,
  ) {
    const lesson = this.lessonRepository.create(createLessonDto);
    return this.lessonRepository.save(lesson);
  }

  async findAll(moduleId?: number, studentId?: number, userRole?: UserRole) {
    if (studentId) {
      return this.lessonRepository
        .createQueryBuilder('lesson')
        .leftJoin('lesson.module', 'module')
        .leftJoin('module.course', 'course')
        .leftJoin('course.studentCourses', 'sc')
        .where('sc.studentId = :studentId', { studentId })
        .andWhere('lesson.moduleId = :moduleId', { moduleId })
        .getMany();
    }

    if (moduleId) {
      return this.lessonRepository.find({
        where: { moduleId },
        order: { order: 'ASC' },
      });
    }

    return this.lessonRepository.find({
      relations: ['module'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number, studentId?: number, userRole?: UserRole) {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['module', 'module.course'],
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (studentId) {
      const hasAccess = await this.lessonRepository
        .createQueryBuilder('lesson')
        .leftJoin('lesson.module', 'module')
        .leftJoin('module.course', 'course')
        .leftJoin('course.studentCourses', 'sc')
        .where('lesson.id = :lessonId', { lessonId: id })
        .andWhere('sc.studentId = :studentId', { studentId })
        .getOne();

      if (!hasAccess) {
        throw new ForbiddenException('Access denied');
      }
    }

    return lesson;
  }

  async update(
    id: number,
    updateLessonDto: UpdateLessonDto,
    userId?: number,
    userRole?: UserRole,
  ) {
    const lesson = await this.findOne(id);

    if (userRole === UserRole.TEACHER) {
      if (lesson.module.course.teacherUserId !== userId) {
        throw new ForbiddenException('Access denied');
      }
    }

    Object.assign(lesson, updateLessonDto);
    return this.lessonRepository.save(lesson);
  }

  async remove(id: number, userId?: number, userRole?: UserRole) {
    const lesson = await this.findOne(id);

    if (userRole === UserRole.TEACHER) {
      if (lesson.module.course.teacherUserId !== userId) {
        throw new ForbiddenException('Access denied');
      }
    }

    return this.lessonRepository.remove(lesson);
  }
}
