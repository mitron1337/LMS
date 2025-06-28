import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './result.entity';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { Assignment } from '../assignments/assignment.entity';
import { CreateResultDto, UpdateResultDto } from './dto/result.dto';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
  ) {}

  async create(createResultDto: CreateResultDto) {
    const result = this.resultRepository.create(createResultDto);
    return this.resultRepository.save(result);
  }

  async findAll() {
    return this.resultRepository.find({
      relations: ['student', 'course'],
    });
  }

  async findOne(id: number) {
    const result = await this.resultRepository.findOne({
      where: { id },
      relations: ['student', 'course'],
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    return result;
  }

  async findByStudentId(studentId: number) {
    return this.resultRepository.find({
      where: { studentId },
      relations: ['course'],
    });
  }

  async findByCourseId(courseId: number) {
    return this.resultRepository.find({
      where: { courseId },
      relations: ['student'],
    });
  }

  async calculateCourseResult(studentId: number, courseId: number) {
    const assignments = await this.resultRepository
      .createQueryBuilder('result')
      .where('result.studentId = :studentId', { studentId })
      .andWhere('result.courseId = :courseId', { courseId })
      .getMany();

    const totalScore = assignments.reduce(
      (sum, assignment) => sum + assignment.score,
      0,
    );
    const maxScore = assignments.length * 100;
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const isPassed = percentage >= 60;

    const existingResult = await this.resultRepository.findOne({
      where: { studentId, courseId },
    });

    if (existingResult) {
      existingResult.score = totalScore;
      existingResult.percentage = percentage;
      existingResult.isPassed = isPassed;
      return this.resultRepository.save(existingResult);
    }

    const result = this.resultRepository.create({
      studentId,
      courseId,
      score: totalScore,
      percentage,
      isPassed,
    });

    return this.resultRepository.save(result);
  }

  async update(id: number, updateResultDto: UpdateResultDto) {
    const result = await this.findOne(id);
    Object.assign(result, updateResultDto);
    return this.resultRepository.save(result);
  }

  async remove(id: number) {
    const result = await this.findOne(id);
    return this.resultRepository.remove(result);
  }
}
