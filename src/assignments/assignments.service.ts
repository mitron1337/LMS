import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from '../users/user.entity';
import { Module } from '../modules/module.entity';
import { SubmitAssignmentDto, GradeAssignmentDto } from './dto/assignment.dto';
import { StudentCoursesService } from '../student-courses/student-courses.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/assignment.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
    private studentCoursesService: StudentCoursesService,
  ) {}

  async submitAssignment(
    studentId: number,
    submitAssignmentDto: SubmitAssignmentDto,
  ): Promise<Assignment> {
    const { moduleId, content, fileUrl } = submitAssignmentDto;

    // Проверяем, существует ли модуль
    const module = await this.moduleRepository.findOne({
      where: { id: moduleId },
      relations: ['course'],
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    // Проверяем, записан ли студент на курс
    const isEnrolled = await this.studentCoursesService.checkEnrollment(
      studentId,
      module.courseId,
    );
    if (!isEnrolled) {
      throw new ForbiddenException(
        'You must be enrolled in the course to submit assignments',
      );
    }

    // Создаем задание
    const assignment = this.assignmentRepository.create({
      studentId,
      moduleId,
      content,
      fileUrl,
      isGraded: false,
    });

    return this.assignmentRepository.save(assignment);
  }

  async gradeAssignment(
    assignmentId: number,
    gradeAssignmentDto: GradeAssignmentDto,
  ): Promise<Assignment> {
    const { grade } = gradeAssignmentDto;

    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
    });
    if (!assignment) {
      throw new NotFoundException(
        `Assignment with ID ${assignmentId} not found`,
      );
    }

    assignment.grade = grade;
    assignment.isGraded = true;

    return this.assignmentRepository.save(assignment);
  }

  async getStudentAssignments(studentId: number): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      where: { studentId },
      relations: ['module', 'module.course'],
    });
  }

  async getModuleAssignments(moduleId: number): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      where: { moduleId },
      relations: ['student'],
    });
  }

  async create(
    createAssignmentDto: CreateAssignmentDto,
    userId?: number,
    userRole?: UserRole,
  ) {
    const assignment = this.assignmentRepository.create(createAssignmentDto);
    return this.assignmentRepository.save(assignment);
  }

  async findAll(moduleId?: number, studentId?: number, userRole?: UserRole) {
    if (moduleId) {
      return this.assignmentRepository.find({
        where: { moduleId },
      });
    }

    return this.assignmentRepository.find({
      relations: ['module'],
    });
  }

  async findOne(id: number, studentId?: number, userRole?: UserRole) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['module'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async update(
    id: number,
    updateAssignmentDto: UpdateAssignmentDto,
    userId?: number,
    userRole?: UserRole,
  ) {
    const assignment = await this.findOne(id);

    if (userRole === UserRole.TEACHER) {
      const hasAccess = await this.assignmentRepository
        .createQueryBuilder('assignment')
        .leftJoin('assignment.module', 'module')
        .leftJoin('module.course', 'course')
        .where('assignment.id = :assignmentId', { assignmentId: id })
        .andWhere('course.teacherUserId = :teacherId', { teacherId: userId })
        .getOne();

      if (!hasAccess) {
        throw new ForbiddenException('Access denied');
      }
    }

    Object.assign(assignment, updateAssignmentDto);
    return this.assignmentRepository.save(assignment);
  }

  async remove(id: number, userId?: number, userRole?: UserRole) {
    const assignment = await this.findOne(id);

    if (userRole === UserRole.TEACHER) {
      const hasAccess = await this.assignmentRepository
        .createQueryBuilder('assignment')
        .leftJoin('assignment.module', 'module')
        .leftJoin('module.course', 'course')
        .where('assignment.id = :assignmentId', { assignmentId: id })
        .andWhere('course.teacherUserId = :teacherId', { teacherId: userId })
        .getOne();

      if (!hasAccess) {
        throw new ForbiddenException('Access denied');
      }
    }

    return this.assignmentRepository.remove(assignment);
  }
}
