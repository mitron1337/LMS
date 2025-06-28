import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Module } from '../modules/module.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  fileUrl: string;

  @ManyToOne(() => User, (user) => user.assignments)
  student: User;

  @Column()
  studentId: number;

  @ManyToOne(() => Module, (module) => module.assignments)
  module: Module;

  @Column()
  moduleId: number;

  @Column({ default: false })
  isGraded: boolean;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  grade: number;

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
