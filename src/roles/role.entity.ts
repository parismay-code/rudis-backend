import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '1', description: 'Role ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'admin', description: 'Role name' })
  name: string;

  @Column()
  @ApiProperty({ example: 'Administrator', description: 'Role description' })
  description: string;

  @Column()
  @ApiProperty({ example: 99, description: 'Role priority' })
  priority: number;
}
