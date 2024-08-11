import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  username: string = '';

  @Column()
  email: string = '';

  @Column()
  password: string = '';

  @Column()
  role: string = 'Reader';
}
