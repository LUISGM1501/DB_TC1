import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Post } from './Post';

@Entity()
@Unique(['email'])  // Asegura que el email sea único
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  @OneToMany(() => Post, post => post.user)
  posts!: Post[];  // Relación con los posts
}
