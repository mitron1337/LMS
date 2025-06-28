import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StudentCourse } from '../student-courses/student-course.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Result } from '../results/result.entity';
import { Course } from '../courses/course.entity';
import { Lesson } from '../lessons/lesson.entity';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StudentCourse, (studentCourse) => studentCourse.student)
  studentCourses: StudentCourse[];

  @OneToMany(() => Assignment, (assignment) => assignment.student)
  assignments: Assignment[];

  @OneToMany(() => Result, (result) => result.student)
  results: Result[];

  @OneToMany(() => Course, (course) => course.teacherUser)
  teachingCourses: Course[];

  @OneToMany(() => Lesson, (lesson) => lesson.teacherUser)
  teachingLessons: Lesson[];
}
