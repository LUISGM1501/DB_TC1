import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ nullable: true })
  type?: string;  // Puede ser 'text', 'image', 'video', etc.

  @ManyToOne(() => User, user => user.posts)
  user!: User;
}
