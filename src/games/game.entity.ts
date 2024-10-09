import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '../rooms/room.entity';
import { GameRole } from './game-role.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '1', description: 'Game ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'Mafia', description: 'Game name' })
  name: string;

  @Column()
  @ApiProperty({ example: 'Description', description: 'Game description' })
  description: string;

  @Column()
  @ApiProperty({ example: '1', description: 'Minimal players count' })
  minPlayers: number;

  @Column()
  @ApiProperty({ example: '20', description: 'Maximal players count' })
  maxPlayers: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Room, (room) => room.game)
  rooms: Room[];

  @OneToMany(() => GameRole, (role) => role.game)
  roles: GameRole[];
}
