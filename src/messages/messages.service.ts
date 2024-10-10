import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Message } from './message.entity';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly roomsService: RoomsService,
  ) {}

  private checkAuthor(message: Message, user: User) {
    if (
      message.user.id !== user.id ||
      user.roles.find((role) => role.priority >= 50)
    ) {
      throw new HttpException(
        'Only message author can do this',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }

  async createMessage({ text, roomId, replyId }: CreateMessageDto, user: User) {
    const message = this.messagesRepository.create({ text });

    const room = await this.roomsService.getRoomById(roomId);

    message.user = user;
    message.room = room;

    if (replyId) {
      message.reply = await this.getMessageById(replyId);
    }

    return await this.messagesRepository.save(message);
  }

  async deleteMessage(id: number, user: User) {
    const message = await this.getMessageById(id);

    this.checkAuthor(message, user);

    await this.messagesRepository.delete(message.id);

    return message;
  }

  async getAllMessages(id: number) {
    return await this.messagesRepository.find({
      where: { room: { id: Equal(id) } },
      take: 50,
      order: { createdAt: 'DESC' },
      relations: {
        user: true,
        reply: true,
      },
      select: {
        user: {
          id: true,
          login: true,
          avatar: true,
        },
        reply: {
          id: true,
        },
      },
    });
  }

  async getMessageById(id: number) {
    const message = await this.messagesRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        user: true,
        reply: true,
      },
      select: {
        user: {
          id: true,
          login: true,
          avatar: true,
        },
        reply: {
          id: true,
        },
      },
    });

    if (!message) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }

    return message;
  }
}
