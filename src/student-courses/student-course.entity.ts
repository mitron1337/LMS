import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity('student_courses')
export class StudentCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.studentCourses)
  student: User;

  @Column()
  studentId: number;

  @ManyToOne(() => Course, (course) => course.studentCourses)
  course: Course;

  @Column()
  courseId: number;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  enrolledAt: Date;
}
