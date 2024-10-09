import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Game } from '../games/game.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @ManyToOne(() => Game, (game) => game.rooms, { onDelete: 'CASCADE' })
  @JoinTable()
  game: Game;

  @Exclude()
  @Column({ nullable: true })
  @ApiProperty({ example: 'password', description: 'Room password' })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({ example: '20', description: 'Maximal players count' })
  maxPlayers: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: User;
}
