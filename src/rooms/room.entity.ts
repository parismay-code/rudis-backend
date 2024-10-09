import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from '../messages/message.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '1', description: 'Room ID' })
  id: number;

  @Column()
  @ApiProperty({ example: 'Mafia room', description: 'Room name' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Description', description: 'Room description' })
  description: string;

  @Exclude()
  @Column({ nullable: true })
  @ApiProperty({ example: 'password', description: 'Room password' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: User;

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
