import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/role.entity';
import { Message } from '../messages/message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '1', description: 'User ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'login', description: 'User login' })
  login: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'avatar.jpg', description: 'User avatar' })
  avatar: string;

  @Exclude()
  @Column()
  @ApiProperty({ example: 'password', description: 'User password' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
