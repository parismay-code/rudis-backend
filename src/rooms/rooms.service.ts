import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Room } from './room.entity';
import { User } from '../users/user.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomsRepository: Repository<Room>,
  ) {}

  private checkOwner(room: Room, user: User) {
    if (
      room.owner.id !== user.id ||
      user.roles.find((role) => role.priority >= 50)
    ) {
      throw new HttpException(
        'Only room owner can do this',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }

  private async prepareData(data: CreateRoomDto) {
    if (data.password) {
      const hashPassword = await bcrypt.hash(data.password, 5);

      Object.assign(data, { password: hashPassword });
    }

    return data;
  }

  async createRoom(data: CreateRoomDto) {
    data = await this.prepareData(data);

    const room = this.roomsRepository.create(data);

    return await this.roomsRepository.save(room);
  }

  async updateRoom(id: number, data: CreateRoomDto, user: User) {
    const room = await this.getRoomById(id);

    this.checkOwner(room, user);

    data = await this.prepareData(data);

    Object.assign(room, data);

    return await this.roomsRepository.save(room);
  }

  async deleteRoom(id: number, user: User) {
    const room = await this.getRoomById(id);

    this.checkOwner(room, user);

    await this.roomsRepository.delete(room.id);

    return room;
  }

  async getAllRooms() {
    return await this.roomsRepository.find({
      relations: {
        game: true,
        owner: true,
      },
      select: {
        owner: {
          id: true,
        },
      },
    });
  }

  async getRoomById(id: number) {
    const room = await this.roomsRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        game: true,
        owner: true,
      },
      select: {
        owner: {
          id: true,
        },
      },
    });

    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    return room;
  }

  async joinRoom(data: JoinRoomDto) {
    const room = await this.getRoomById(data.roomId);

    const passwordEquals = await bcrypt.compare(data.password, room.password);

    if (!passwordEquals) {
      throw new HttpException('Incorrect room password', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
