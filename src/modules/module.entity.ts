import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Course } from '../courses/course.entity';
import { Lesson } from '../lessons/lesson.entity';
import { Assignment } from '../assignments/assignment.entity';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  order: number;

  @ManyToOne(() => Course, (course) => course.modules)
  course: Course;

  @Column()
  courseId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Lesson[];

  @OneToMany(() => Assignment, (assignment) => assignment.module)
  assignments: Assignment[];
}
