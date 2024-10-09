import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '../rooms/room.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '1', description: 'Message ID' })
  id: number;

  @Column()
  @ApiProperty({ example: 'Hello World!', description: 'Message text' })
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Message, { onDelete: 'SET NULL' })
  @JoinColumn()
  reply: Message;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Room, (room) => room.messages, { onDelete: 'CASCADE' })
  room: Room;
}
