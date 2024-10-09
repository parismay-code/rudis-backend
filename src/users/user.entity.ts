import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/role.entity';
import { Game } from '../games/game.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '1', description: 'User ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'login', description: 'User login' })
  login: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'users@example.ru', description: 'User email' })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'avatar.jpg', description: 'User avatar' })
  avatar: string;

  @Exclude()
  @Column({ nullable: true, unique: true })
  @ApiProperty({
    example: 'streamer token hash',
    description: 'Streamer token',
  })
  streamerToken: string;

  @Exclude()
  @Column()
  @ApiProperty({ example: 'password', description: 'User password' })
  password: string;

  @Column({ default: false })
  @ApiProperty({ example: 'false', description: 'User banned sign' })
  banned: boolean;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Ban reason', description: 'User ban reason' })
  banReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Game)
  @JoinTable()
  games: Game[];
}
