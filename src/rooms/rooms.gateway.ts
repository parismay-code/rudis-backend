import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as bcrypt from 'bcrypt';
import { RoomsService } from './rooms.service';
import { User } from '../users/user.entity';
import { Room } from './room.entity';
import { Message } from '../messages/message.entity';
import { MessagesService } from '../messages/messages.service';

type UserRTCData = {
  role: string | null;
  socketId: string | null;
  disconnected: boolean;
};

type RoomUser = User & UserRTCData;

type RoomData = {
  model: Room;
  users: RoomUser[];
  messages: Message[];
};

type JoinRoomData = {
  id: number;
  password?: string;
  user: User;
};

type SendOfferData = {
  to: string;
  offer: RTCSessionDescriptionInit;
};

type SendAnswerData = {
  to: string;
  answer: RTCSessionDescriptionInit;
};

type IceCandidateData = {
  to: string;
  candidate: RTCIceCandidate;
};

type MessageData = {
  text: string;
  roomId: number;
  replyId?: number;
  user: User;
};

type DeleteMessageData = {
  roomId: number;
  messageId: number;
  user: User;
};

@WebSocketGateway(Number(process.env.SOCKET_PORT || 81), {
  transports: ['websocket'],
})
export class RoomsGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly roomsService: RoomsService,
    private readonly messagesService: MessagesService,
  ) {}

  private rooms: Map<string, RoomData> = new Map();

  private socketsRooms: Map<string, string> = new Map();

  private kickUserFromRoomTimeouts: Map<number, NodeJS.Timeout> = new Map();

  private async findOrSetRoom(id: number) {
    const roomName = `room_${id}`;

    let room = this.rooms.get(roomName);

    if (!room) {
      const model = await this.roomsService.getRoomById(id);
      const messages = await this.messagesService.getAllMessages(id);

      room = {
        model,
        users: [],
        messages,
      };

      this.rooms.set(roomName, room);
    }

    return { roomName, room };
  }

  handleDisconnect(socket: Socket) {
    const roomName = this.socketsRooms.get(socket.id);

    if (!roomName) {
      return;
    }

    const room = this.rooms.get(roomName);

    if (!room) {
      return;
    }

    const roomUser = room.users.find((user) => user.socketId === socket.id);

    if (roomUser) {
      roomUser.disconnected = true;

      this.rooms.set(roomName, room);

      const kickUserTimeout = setTimeout(() => {
        this.kickUserFromRoomTimeouts.delete(roomUser.id);

        this.rooms.set(roomName, {
          ...room,
          users: room.users.filter((user) => {
            return user.socketId !== socket.id;
          }),
        });
      }, 60000);

      this.kickUserFromRoomTimeouts.set(roomUser.id, kickUserTimeout);

      this.server
        .in(roomName)
        .emit('participantDisconnected', { socketId: socket.id });
    }
  }

  @SubscribeMessage('joinRoom')
  async onRoomJoined(
    @MessageBody() { id, user, password }: JoinRoomData,
    @ConnectedSocket() socket: Socket,
  ) {
    if (!user) {
      throw new WsException('User not found');
    }

    const { roomName, room } = await this.findOrSetRoom(id);

    const roomUser = room.users.find((roomUser) => roomUser.id === user.id);

    let userData: RoomUser = null;

    if (roomUser) {
      if (!roomUser.disconnected) {
        throw new WsException('User already in room');
      }

      clearTimeout(this.kickUserFromRoomTimeouts.get(user.id));
      this.kickUserFromRoomTimeouts.delete(user.id);

      roomUser.disconnected = false;
      roomUser.socketId = socket.id;

      userData = roomUser;

      this.rooms.set(roomName, {
        ...room,
      });
    } else {
      if (room.model.password) {
        if (!password) {
          throw new WsException('Room is private');
        }

        const passwordEquals = await bcrypt.compare(
          password,
          room.model.password,
        );

        if (!passwordEquals) {
          throw new WsException('Incorrect room password');
        }
      }

      userData = {
        ...user,
        socketId: socket.id,
        role: null,
        disconnected: false,
      };

      this.rooms.set(roomName, {
        ...room,
        users: [...room.users, userData],
      });
    }

    this.socketsRooms.set(socket.id, roomName);

    this.server.in(roomName).emit('newParticipant', { user: userData });

    socket.emit('roomData', { ...room });

    socket.join(roomName);
  }

  @SubscribeMessage('requestOffer')
  onOfferRequest(
    @MessageBody('to') to: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.to(to).emit('requestOffer', { from: socket.id });
  }

  @SubscribeMessage('participants')
  async onParticipants(
    @MessageBody('id') id: number,
    @ConnectedSocket() socket: Socket,
  ) {
    const { room } = await this.findOrSetRoom(id);

    socket.emit('participants', room.users);
  }

  @SubscribeMessage('sendOffer')
  onOfferSent(
    @MessageBody()
    { to, offer }: SendOfferData,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.to(to).emit('offer', { offer, from: socket.id });
  }

  @SubscribeMessage('sendAnswer')
  onAnswerSent(
    @MessageBody()
    { to, answer }: SendAnswerData,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.to(to).emit('answer', { answer, from: socket.id });
  }

  @SubscribeMessage('icecandidate')
  onIceCandidate(
    @MessageBody()
    { candidate, to }: IceCandidateData,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.to(to).emit('icecandidate', { candidate, from: socket.id });
  }

  @SubscribeMessage('sendMessage')
  async onMessageSent(
    @MessageBody()
    { text, roomId, replyId, user }: MessageData,
  ) {
    const { roomName, room } = await this.findOrSetRoom(roomId);

    const { id } = await this.messagesService.createMessage(
      { text, roomId, replyId },
      user,
    );

    const message = await this.messagesService.getMessageById(id);

    room.messages.unshift(message);

    this.rooms.set(roomName, room);

    this.server.in(roomName).emit('message', { message });
  }

  @SubscribeMessage('deleteMessage')
  async onMessageDeleted(
    @MessageBody()
    { roomId, messageId, user }: DeleteMessageData,
  ) {
    const { roomName, room } = await this.findOrSetRoom(roomId);

    await this.messagesService.deleteMessage(messageId, user);

    room.messages = room.messages.filter((message) => message.id !== messageId);

    this.rooms.set(roomName, room);

    this.server.in(roomName).emit('messageDeleted', { messageId });
  }
}
