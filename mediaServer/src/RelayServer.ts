import { Server, Socket } from 'socket.io';
import { RTCIceCandidate, RTCPeerConnection } from 'wrtc';
import { pc_config } from './config/pc.config';
import { RoomConnectionInfo } from './models/RoomConnectionInfo';
import { ClientConnectionInfo } from './models/ClientConnectionInfo';
import { ClientType } from './constants/client-type.constant';
import { Message } from './models/Message';
import { mediaConverter } from './utils/MediaConverter';
import { getEmailByJwtPayload } from './utils/auth';
import { findClientInfoByEmail, saveClientInfo } from './services/client.service';
import { deleteRoomInfoById, findRoomInfoById, saveRoomInfo, updateWhiteboardData } from './services/room.service';
import { RoomInfoDto } from './dto/room-info.dto';

export class RelayServer {
  private readonly io;
  private readonly roomsConnectionInfo: Map<string, RoomConnectionInfo>;
  private readonly clientsConnectionInfo: Map<string, ClientConnectionInfo>;

  constructor(port: number) {
    this.roomsConnectionInfo = new Map();
    this.clientsConnectionInfo = new Map();
    this.io = new Server(port, {
      cors: {
        // TODO: 특정 URL만 origin 하도록 수정 필요
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
  }

  listen = (path: string, event: string, method: (socket: Socket) => void) => {
    this.io.of(path).on(event, method);
  };

  createRoom = (socket: Socket) => {
    try {
      const email: string = getEmailByJwtPayload(socket.handshake.auth.accessToken);
      if (this.clientsConnectionInfo.has(email)) {
        // TODO: 이미 참여 중인 방이 있을 때, 클라이언트한테 재 참여할건지 물어보기. 아니면 한 강의실만 참여할 수 있다고 해도 좋음
      }
      socket.on('presenterOffer', async (data) => {
        const RTCPC = new RTCPeerConnection(pc_config);
        this.clientsConnectionInfo.set(email, new ClientConnectionInfo(RTCPC));
        this.roomsConnectionInfo.set(data.roomId, new RoomConnectionInfo(RTCPC));
        await Promise.all([
          saveClientInfo(email, ClientType.PRESENTER, data.roomId),
          saveRoomInfo(data.roomId, new RoomInfoDto(email))
        ]);

        RTCPC.ontrack = (event) => {
          const roomInfo = this.roomsConnectionInfo.get(data.roomId);
          if (roomInfo) {
            roomInfo.stream = event.streams[0];
            mediaConverter.setSink(event.streams[0], data.roomId);
          }
        };

        socket.join(email);
        this.exchangeCandidate('/create-room', email, socket);

        await RTCPC.setRemoteDescription(data.SDP);
        const SDP = await RTCPC.createAnswer();
        this.io.of('/create-room').to(email).emit('serverAnswer', {
          SDP: SDP
        });
        RTCPC.setLocalDescription(SDP);

        const clientInfo = this.clientsConnectionInfo.get(email);
        if (!clientInfo) {
          throw new Error('해당 발표자가 존재하지 않습니다.');
        }
        clientInfo.enterSocket = socket;
      });
    } catch (e) {
      console.log(e);
    }
  };

  enterRoom = (socket: Socket) => {
    try {
      const email: string = getEmailByJwtPayload(socket.handshake.auth.accessToken);
      if (this.clientsConnectionInfo.has(email)) {
        // TODO: 이미 참여 중인 방이 있을 때, 클라이언트한테 재 참여할건지 물어보기. 아니면 한 강의실만 참여할 수 있다고 해도 좋음
      }
      socket.on('studentOffer', async (data) => {
        const RTCPC = new RTCPeerConnection(pc_config);
        this.clientsConnectionInfo.set(email, new ClientConnectionInfo(RTCPC));
        saveClientInfo(email, ClientType.STUDENT, data.roomId);

        const presenterStream = this.roomsConnectionInfo.get(data.roomId)?.stream;
        if (!presenterStream) {
          console.log('발표자의 MediaStream이 존재하지 않습니다.');
          return;
        }
        presenterStream.getTracks().forEach((track: any) => {
          RTCPC.addTrack(track);
        });

        socket.join(email);
        this.exchangeCandidate('/enter-room', email, socket);

        const [result, roomInfo, SDP] = await Promise.all([
          RTCPC.setRemoteDescription(data.SDP),
          findRoomInfoById(data.roomId),
          RTCPC.createAnswer()
        ]);
        this.io
          .of('/enter-room')
          .to(email)
          .emit(`serverAnswer`, {
            whiteboard: JSON.parse(roomInfo.currentWhiteboardData),
            startTime: roomInfo.startTime,
            SDP: SDP
          });
        RTCPC.setLocalDescription(SDP);

        const clientConnectionInfo = this.clientsConnectionInfo.get(email);
        if (!clientConnectionInfo) {
          console.log('해당 참여자가 존재하지 않습니다.');
          return;
        }
        clientConnectionInfo.enterSocket = socket;
      });
    } catch (e) {
      console.log(e);
    }
  };

  // TODO: 클라이언트는 한 개의 방만 접속할 수 있는지? 만약 그렇다면, 이미 참여 중인 빙이 있을 때 요청 거부하도록 처리해야 함
  lecture = async (socket: Socket) => {
    const email: string = getEmailByJwtPayload(socket.handshake.auth.accessToken);
    const clientInfo = await findClientInfoByEmail(email);
    const clientConnectionInfo = await this.clientsConnectionInfo.get(email);
    if (!clientInfo || !clientConnectionInfo || !clientInfo.roomId) {
      // TODO: 추후 클라이언트로 에러처리 필요
      console.log('잘못된 요청입니다.');
      return;
    }
    const roomInfo = await findRoomInfoById(clientInfo.roomId);
    const roomConnectionInfo = this.roomsConnectionInfo.get(clientInfo.roomId);
    if (!roomConnectionInfo) {
      // TODO: 추후 클라이언트로 에러처리 필요
      console.log('아직 열리지 않았거나 종료된 방입니다.');
      return;
    }
    clientConnectionInfo.lectureSocket = socket;
    socket.join(clientInfo.roomId);
    if (clientInfo.type === ClientType.PRESENTER) {
      roomConnectionInfo.presenterSocket = socket;
      socket.join(email);
      // TODO: API 서버에 강의 시작 요청하기
    }
    if (clientInfo.type === ClientType.STUDENT) {
      roomConnectionInfo.studentInfoList.add(clientConnectionInfo);
    }

    socket.on('edit', async (data) => {
      if (clientInfo.type !== ClientType.PRESENTER || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 발표자가 존재하지 않습니다.');
        return;
      }
      await updateWhiteboardData(data.roomId, data.content);
      this.io.of('/lecture').to(clientInfo.roomId).emit('update', new Message(data.type, data.content));
    });

    socket.on('ask', (data) => {
      if (clientInfo.type !== ClientType.STUDENT || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 참여자가 존재하지 않습니다.');
        return;
      }
      const presenterEmail = roomInfo.presenterEmail;
      if (!presenterEmail) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('발표자가 없습니다.');
        return;
      }
      this.io.of('/lecture').to(presenterEmail).emit('asked', new Message(data.type, data.content));
    });

    socket.on('end', async (data) => {
      if (clientInfo.type !== ClientType.PRESENTER || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 발표자가 존재하지 않습니다');
        return;
      }
      this.io.of('/lecture').to(data.roomId).emit('ended', new Message(data.type, 'finish'));
      mediaConverter.setFfmpeg(data.roomId);
      this.roomsConnectionInfo.get(clientInfo.roomId)?.endLecture(data.roomId);
      this.roomsConnectionInfo.delete(clientInfo.roomId);
      this.clientsConnectionInfo.delete(email);
      await deleteRoomInfoById(data.roomId);
      // TODO: API 서버에 강의 종료 요청하기
    });

    socket.on('leave', (data) => {
      if (clientInfo.type !== ClientType.STUDENT || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 참여자가 존재하지 않습니다');
        return;
      }
      this.roomsConnectionInfo.get(clientInfo.roomId)?.exitRoom(clientConnectionInfo, data.roomId);
      this.io.of('/lecture').to(clientInfo.roomId).emit('response', new Message(data.type, 'success'));
    });
  };

  exchangeCandidate = (namespace: string, email: string, socket: Socket) => {
    try {
      const RTCPC = this.clientsConnectionInfo.get(email)?.RTCPC;
      if (!RTCPC) {
        console.log('candidate를 교환할 수 없습니다.');
        return;
      }
      RTCPC.onicecandidate = (e) => {
        if (e.candidate) {
          this.io.of(namespace).to(email).emit(`serverCandidate`, {
            candidate: e.candidate
          });
        }
      };
      socket.on('clientCandidate', (data) => {
        RTCPC.addIceCandidate(new RTCIceCandidate(data.candidate));
      });
    } catch (e) {
      console.log(e);
    }
  };
}
