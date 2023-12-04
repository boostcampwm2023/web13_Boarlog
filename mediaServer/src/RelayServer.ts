import { Server, Socket } from 'socket.io';
import { RTCIceCandidate, RTCPeerConnection } from 'wrtc';
import { pc_config } from './config/pc.config';
import { RoomInfo } from './models/RoomInfo';
import { ClientInfo, ClientType } from './models/ClientInfo';
import { Message } from './models/Message';
import { mediaConverter } from './utils/MediaConverter';
import { getEmailByJwtPayload } from './utils/auth';

export class RelayServer {
  private readonly io;
  private readonly roomsInfo: Map<string, RoomInfo>;
  private readonly clientsInfo: Map<string, ClientInfo>;

  constructor(port: number) {
    this.roomsInfo = new Map();
    this.clientsInfo = new Map();
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
      if (this.clientsInfo.has(email)) {
        // TODO: 이미 참여 중인 방이 있을 때, 클라이언트한테 재 참여할건지 물어보기
        //  아니면 한 강의실만 참여할 수 있다고 해도 좋음
      }
      socket.on('presenterOffer', async (data) => {
        const RTCPC = new RTCPeerConnection(pc_config);
        this.clientsInfo.set(email, new ClientInfo(ClientType.PRESENTER, RTCPC, data.roomId));
        this.roomsInfo.set(data.roomId, new RoomInfo(data.roomId, email, RTCPC));
        RTCPC.ontrack = (event) => {
          const roomInfo = this.roomsInfo.get(data.roomId);
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

        const clientInfo = this.clientsInfo.get(email);
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
      if (this.clientsInfo.has(email)) {
        // TODO: 이미 참여 중인 방이 있을 때, 클라이언트한테 재 참여할건지 물어보기
        //  아니면 한 강의실만 참여할 수 있다고 해도 좋음
      }
      socket.on('studentOffer', async (data) => {
        const RTCPC = new RTCPeerConnection(pc_config);
        this.clientsInfo.set(email, new ClientInfo(ClientType.STUDENT, RTCPC, data.roomId));
        const presenterStream = this.roomsInfo.get(data.roomId)?.stream;
        if (!presenterStream) {
          console.log('발표자의 MediaStream이 존재하지 않습니다.');
          return;
        }
        presenterStream.getTracks().forEach((track: any) => {
          RTCPC.addTrack(track);
        });

        socket.join(email);
        this.exchangeCandidate('/enter-room', email, socket);

        await RTCPC.setRemoteDescription(data.SDP);
        const SDP = await RTCPC.createAnswer();
        this.io.of('/enter-room').to(email).emit(`serverAnswer`, {
          SDP: SDP
        });
        RTCPC.setLocalDescription(SDP);

        const roomInfo = this.roomsInfo.get(data.roomId);
        const clientInfo = this.clientsInfo.get(email);
        if (!clientInfo || !roomInfo) {
          // TODO: 추후 에러처리 필요
          console.log('해당 참여자가 존재하지 않습니다.');
          return;
        }
        clientInfo.enterSocket = socket;
      });
    } catch (e) {
      console.log(e);
    }
  };

  // TODO: 클라이언트는 한 개의 방만 접속할 수 있는지?
  //  만약 그렇다면, 이미 참여 중인 빙이 있을 때 요청 거부하도록 처리해야 함
  lecture = (socket: Socket) => {
    const email: string = getEmailByJwtPayload(socket.handshake.auth.accessToken);
    const clientInfo = this.clientsInfo.get(email);
    if (!clientInfo || !clientInfo.roomId) {
      // TODO: 추후 클라이언트로 에러처리 필요
      console.log('잘못된 요청입니다.');
      return;
    }
    const roomInfo = this.roomsInfo.get(clientInfo.roomId);
    if (!roomInfo) {
      // TODO: 추후 클라이언트로 에러처리 필요
      console.log('아직 열리지 않았거나 종료된 방입니다.');
      return;
    }
    if (clientInfo) {
      clientInfo.lectureSocket = socket;
      socket.join(clientInfo.roomId);
      if (clientInfo.type === ClientType.PRESENTER) {
        roomInfo.presenterSocket = socket;
        socket.join(email);
      }
      if (clientInfo.type === ClientType.STUDENT) {
        roomInfo.studentInfoList.add(clientInfo);
      }
    }

    socket.on('edit', (data) => {
      if (clientInfo.type !== ClientType.PRESENTER || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 발표자가 존재하지 않습니다.');
        return;
      }
      this.io.of('/lecture').to(clientInfo.roomId).emit('update', new Message(data.type, data.content));
    });

    socket.on('ask', (data) => {
      if (clientInfo.type !== ClientType.STUDENT || clientInfo !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 참여자가 존재하지 않습니다.');
        return;
      }
      const presenterEmail = this.roomsInfo.get(clientInfo.roomId)?.presenterEmail;
      if (!presenterEmail) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('발표자가 없습니다.');
        return;
      }
      this.io.of('/lecture').to(presenterEmail).emit('asked', new Message(data.type, data.content));
    });

    socket.on('end', (data) => {
      if (clientInfo.type !== ClientType.PRESENTER || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 발표자가 존재하지 않습니다');
        return;
      }
      this.io.of('/lecture').to(data.roomId).emit('ended', new Message(data.type, 'finish'));
      mediaConverter.setFfmpeg(data.roomId);
      this.roomsInfo.get(clientInfo.roomId)?.endLecture();
      this.roomsInfo.delete(clientInfo.roomId);
      this.clientsInfo.delete(email);
    });

    socket.on('leave', (data) => {
      if (clientInfo.type !== ClientType.STUDENT || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 참여자가 존재하지 않습니다');
        return;
      }
      this.roomsInfo.get(clientInfo.roomId)?.exitRoom(clientInfo);
      this.io.of('/lecture').to(clientInfo.roomId).emit('response', new Message(data.type, 'success'));
    });
  };

  exchangeCandidate = (namespace: string, email: string, socket: Socket) => {
    try {
      const RTCPC = this.clientsInfo.get(email)?.RTCPC;
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
