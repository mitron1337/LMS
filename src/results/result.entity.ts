import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.results)
  student: User;

  @Column()
  studentId: number;

  @ManyToOne(() => Course)
  course: Course;

  @Column()
  courseId: number;

  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @Column('decimal', { precision: 5, scale: 2 })
  maxScore: number;

  @Column('decimal', { precision: 5, scale: 2 })
  percentage: number;

  @Column({ default: false })
  isPassed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
