import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';

@Entity()
export class GameRole {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '1', description: 'Game role ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'Mafia', description: 'Game role name' })
  name: string;

  @Column()
  @ApiProperty({ example: 'Description', description: 'Game role description' })
  description: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: '20',
    description: 'Maximal players with role count',
  })
  maxPlayers: number;

  @ManyToOne(() => Game, (game) => game.roles, { onDelete: 'CASCADE' })
  @JoinTable()
  game: Game;
}
