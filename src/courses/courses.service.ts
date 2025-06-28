import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    userId?: number,
    userRole?: UserRole,
  ): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async findAll(userId?: number, userRole?: UserRole): Promise<Course[]> {
    if (userRole === UserRole.STUDENT) {
      return this.courseRepository
        .createQueryBuilder('course')
        .leftJoin('course.studentCourses', 'sc')
        .where('sc.studentId = :studentId', { studentId: userId })
        .getMany();
    }

    if (userRole === UserRole.TEACHER) {
      return this.courseRepository.find({
        where: { teacherUserId: userId },
      });
    }

    return this.courseRepository.find();
  }

  async findOne(
    id: number,
    userId?: number,
    userRole?: UserRole,
  ): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (userRole === UserRole.TEACHER && course.teacherUserId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return course;
  }

  async findTeacherCourses(teacherId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: { teacherUserId: teacherId },
    });
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
    userId?: number,
    userRole?: UserRole,
  ): Promise<Course> {
    const course = await this.findOne(id, userId, userRole);

    if (userRole === UserRole.TEACHER && course.teacherUserId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    Object.assign(course, updateCourseDto);
    return this.courseRepository.save(course);
  }

  async remove(
    id: number,
    userId?: number,
    userRole?: UserRole,
  ): Promise<void> {
    const course = await this.findOne(id, userId, userRole);

    if (userRole === UserRole.TEACHER && course.teacherUserId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.courseRepository.remove(course);
  }
}
