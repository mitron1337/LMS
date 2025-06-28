import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCourse } from './student-course.entity';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { EnrollCourseDto } from './dto/student-course.dto';
import { CreateStudentCourseDto } from './dto/student-course.dto';

@Injectable()
export class StudentCoursesService {
  constructor(
    @InjectRepository(StudentCourse)
    private studentCourseRepository: Repository<StudentCourse>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create(createStudentCourseDto: CreateStudentCourseDto) {
    const { studentId, courseId } = createStudentCourseDto;

    const existingCourse = await this.studentCourseRepository.findOne({
      where: { courseId },
    });
    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    const existingEnrollment = await this.studentCourseRepository.findOne({
      where: { studentId, courseId },
    });
    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    const studentCourse = this.studentCourseRepository.create(
      createStudentCourseDto,
    );
    return this.studentCourseRepository.save(studentCourse);
  }

  async findAll() {
    return this.studentCourseRepository.find({
      relations: ['student', 'course'],
    });
  }

  async findOne(id: number) {
    const studentCourse = await this.studentCourseRepository.findOne({
      where: { id },
      relations: ['student', 'course'],
    });

    if (!studentCourse) {
      throw new NotFoundException('Student course not found');
    }

    return studentCourse;
  }

  async findByStudentId(studentId: number) {
    return this.studentCourseRepository.find({
      where: { studentId },
      relations: ['course'],
    });
  }

  async findByCourseId(courseId: number) {
    return this.studentCourseRepository.find({
      where: { courseId },
      relations: ['student'],
    });
  }

  async remove(id: number) {
    const studentCourse = await this.findOne(id);
    return this.studentCourseRepository.remove(studentCourse);
  }

  async checkEnrollment(studentId: number, courseId: number): Promise<boolean> {
    const enrollment = await this.studentCourseRepository.findOne({
      where: { studentId, courseId },
    });
    return !!enrollment;
  }

  async enrollStudent(
    studentId: number,
    enrollCourseDto: EnrollCourseDto,
  ): Promise<StudentCourse> {
    const { courseId } = enrollCourseDto;

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const existingEnrollment = await this.studentCourseRepository.findOne({
      where: { studentId, courseId },
    });

    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    const enrollment = this.studentCourseRepository.create({
      studentId,
      courseId,
      isCompleted: false,
    });

    return this.studentCourseRepository.save(enrollment);
  }

  async getStudentCourses(studentId: number): Promise<StudentCourse[]> {
    return this.studentCourseRepository.find({
      where: { studentId },
      relations: ['course'],
    });
  }

  async completeCourse(
    studentId: number,
    courseId: number,
  ): Promise<StudentCourse> {
    const enrollment = await this.studentCourseRepository.findOne({
      where: { studentId, courseId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    enrollment.isCompleted = true;
    return this.studentCourseRepository.save(enrollment);
  }
}
