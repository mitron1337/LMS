import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Module } from '../modules/module.entity';
import { User } from '../users/user.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  order: number;

  @Column()
  duration: number; // в минутах

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column()
  moduleId: number;

  @ManyToOne(() => Module, (module) => module.lessons)
  @JoinColumn({ name: 'moduleId' })
  module: Module;

  @ManyToOne(() => User, (user) => user.teachingLessons)
  teacherUser: User;

  @Column({ nullable: true })
  teacherUserId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
