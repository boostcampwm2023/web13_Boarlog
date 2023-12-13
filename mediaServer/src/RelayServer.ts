import { Server, Socket } from 'socket.io';
import { RTCIceCandidate, RTCPeerConnection } from 'wrtc';
import { pc_config } from './config/pc.config';
import { RoomConnectionInfo } from './models/RoomConnectionInfo';
import { ClientConnectionInfo } from './models/ClientConnectionInfo';
import { ClientType } from './constants/client-type.constant';
import { Message } from './models/Message';
import { mediaConverter } from './utils/MediaConverter';
import { getEmailByJwtPayload } from './utils/auth';
import { findClientInfoByEmail, saveClientInfo, sendDataToReconnectPresenter } from './services/client.service';
import { deleteRoomInfoById, findRoomInfoById, saveRoomInfo, updateWhiteboardData } from './services/room.service';
import { RoomInfoDto } from './dto/room-info.dto';
import {
  deleteQuestionStream,
  findQuestion,
  getStreamKeyAndQuestionFromStream,
  isQuestionStreamExisted,
  saveQuestion,
  setQuestionStreamAndGroup,
  updateQuestionStatus
} from './services/question-service';
import { StreamReadRaw } from './types/redis-stream.type';
import { isCreatedRoomAndNotEqualPresenterEmail } from './validation/request.validation';
import { AskedRequestDto } from './dto/asked.request.dto';
import { ServerAnswerDto } from './dto/serverAnswer.dto';
import { getClientEmail, setParticipantConnection, setPresenterMediaStream } from './services/participant.service';

export class RelayServer {
  private readonly _io;
  private readonly _roomsConnectionInfo: Map<string, RoomConnectionInfo>;
  private readonly _clientsConnectionInfo: Map<string, ClientConnectionInfo>;

  constructor(port: number) {
    this._roomsConnectionInfo = new Map();
    this._clientsConnectionInfo = new Map();
    this._io = new Server(port, {
      cors: {
        // TODO: 특정 URL만 origin 하도록 수정 필요
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
  }

  get socket() {
    return this._io;
  }

  get roomsConnectionInfo() {
    return this._roomsConnectionInfo;
  }

  get clientConnectionInfo() {
    return this._clientsConnectionInfo;
  }

  listen = (path: string, event: string, method: (socket: Socket) => void) => {
    this._io.of(path).on(event, method);
  };

  createRoom = (socket: Socket) => {
    try {
      const email: string = getEmailByJwtPayload(socket.handshake.auth.accessToken);
      if (this._clientsConnectionInfo.has(email)) {
        // TODO: 이미 참여 중인 방이 있을 때, 클라이언트한테 재 참여할건지 물어보기. 아니면 한 강의실만 참여할 수 있다고 해도 좋음
      }

      socket.on('presenterOffer', async (data) => {
        const roomInfo = await findRoomInfoById(data.roomId);
        if (isCreatedRoomAndNotEqualPresenterEmail(email, roomInfo)) {
          console.log('이미 존재하는 강의실입니다.');
          return;
        }
        const RTCPC = new RTCPeerConnection(pc_config);
        this._clientsConnectionInfo.set(email, new ClientConnectionInfo(RTCPC));
        socket.join(email);
        if (roomInfo.presenterEmail !== email) {
          this._roomsConnectionInfo.set(data.roomId, new RoomConnectionInfo(RTCPC));
          if (await isQuestionStreamExisted(data.roomId)) {
            await deleteQuestionStream(data.roomId);
          }
          await setQuestionStreamAndGroup(data.roomId);
          await Promise.all([
            saveClientInfo(email, ClientType.PRESENTER, data.roomId),
            saveRoomInfo(data.roomId, new RoomInfoDto(email, data.whiteboard))
          ]);
        }
        if (roomInfo.presenterEmail === email) {
          await sendDataToReconnectPresenter(email, data.roomId, roomInfo);
        }

        RTCPC.ontrack = (event) => {
          const roomInfo = this._roomsConnectionInfo.get(data.roomId);
          if (roomInfo) {
            roomInfo.stream = event.streams[0];
            roomInfo.studentInfoList.forEach((clientConnectionInfo: ClientConnectionInfo) => {
              event.streams[0].getTracks().forEach((track: any) => {
                clientConnectionInfo.RTCPC.getSenders()[0].replaceTrack(track);
              });
            });
            mediaConverter.setSink(event.streams[0], data.roomId);
          }
        };
        this.exchangeCandidate('/create-room', email, socket);

        await RTCPC.setRemoteDescription(data.SDP);
        const SDP = await RTCPC.createAnswer();
        this._io.of('/create-room').to(email).emit('serverAnswer', {
          SDP: SDP
        });
        RTCPC.setLocalDescription(SDP);

        const clientConnectionInfo = this._clientsConnectionInfo.get(email);
        if (!clientConnectionInfo) {
          throw new Error('해당 발표자가 존재하지 않습니다.');
        }
        clientConnectionInfo.enterSocket = socket;
      });
    } catch (e) {
      console.log(e);
    }
  };

  enterRoom = (socket: Socket) => {
    try {
      const email = getClientEmail(socket);
      const clientType = email ? ClientType.STUDENT : ClientType.GUEST;
      const clientId = email ? email : socket.id;
      socket.on('studentOffer', async (data) => {
        const RTCPC = setParticipantConnection(clientId);
        await saveClientInfo(clientId, clientType, data.roomId);
        setPresenterMediaStream(RTCPC, data.roomId);
        socket.join(clientId);
        this.exchangeCandidate('/enter-room', clientId, socket);
        const [result, roomInfo, SDP] = await Promise.all([
          RTCPC.setRemoteDescription(data.SDP),
          findRoomInfoById(data.roomId),
          RTCPC.createAnswer()
        ]);
        const answerData = new ServerAnswerDto(JSON.parse(roomInfo.currentWhiteboardData), roomInfo.startTime, SDP);
        this._io.of('/enter-room').to(clientId).emit(`serverAnswer`, answerData);
        RTCPC.setLocalDescription(SDP);
        const clientConnectionInfo = this._clientsConnectionInfo.get(clientId) as ClientConnectionInfo;
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
    const clientConnectionInfo = await this._clientsConnectionInfo.get(email);
    if (!clientInfo || !clientConnectionInfo || !clientInfo.roomId) {
      // TODO: 추후 클라이언트로 에러처리 필요
      console.log('잘못된 요청입니다.');
      return;
    }
    const roomInfo = await findRoomInfoById(clientInfo.roomId);
    const roomConnectionInfo = this._roomsConnectionInfo.get(clientInfo.roomId);

    const token = socket.handshake.auth.accessToken;
    const code = clientInfo.roomId;

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
    }
    if (clientInfo.type === ClientType.STUDENT) {
      roomConnectionInfo.studentInfoList.add(clientConnectionInfo);
      // TODO: API 서버에 강의 시작 요청하기
      const response = await fetch((process.env.SERVER_API_URL + '/lecture/' + code) as string, {
        method: 'PATCH',
        headers: { Authorization: token }
      });
      console.log('response: ' + response.status);
    }

    socket.on('edit', async (data) => {
      if (clientInfo.type !== ClientType.PRESENTER || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 발표자가 존재하지 않습니다.');
        return;
      }
      // TODO: API 서버로 화이트보드 데이터 전달
      const response = await fetch(process.env.SERVER_API_URL + '/lecture/log/' + data.roomId, {
        method: 'POST',
        body: data.content
      });
      console.log('response: ' + response.status);

      await Promise.all([
        updateWhiteboardData(data.roomId, data.content),
        this._io.of('/lecture').to(clientInfo.roomId).emit('update', new Message(data.type, data.content))
      ]);
    });

    socket.on('ask', async (data) => {
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
      await saveQuestion(data.roomId, data.content);
      const streamData = (await findQuestion(data.roomId, presenterEmail)) as StreamReadRaw;
      const question = getStreamKeyAndQuestionFromStream(streamData);
      this._io
        .of('/lecture')
        .to(presenterEmail)
        .emit('asked', new AskedRequestDto(data.type, question.content, question.streamKey));
    });

    socket.on('solved', async (data) => {
      if (clientInfo.type !== ClientType.PRESENTER || clientInfo.roomId !== data.roomId) {
        console.log('해당 강의실 발표자만 질문을 완료할 수 있습니다.');
        return;
      }
      await updateQuestionStatus(data.roomId, data.questionId);
    });

    socket.on('response', (data) => {
      if (data.type === 'question') {
        updateQuestionStatus(data.roomId, data.questionId);
      }
    });

    socket.on('end', async (data) => {
      if (clientInfo.type !== ClientType.PRESENTER || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 발표자가 존재하지 않습니다');
        return;
      }
      this._io.of('/lecture').to(data.roomId).emit('ended', new Message(data.type, 'finish'));
      mediaConverter.setFfmpeg(data.roomId);
      this._roomsConnectionInfo.get(clientInfo.roomId)?.endLecture(data.roomId);
      this._roomsConnectionInfo.delete(clientInfo.roomId);
      this._clientsConnectionInfo.delete(email);
      await Promise.all([deleteRoomInfoById(data.roomId), deleteQuestionStream(data.roomId)]);

      // TODO: API 서버에 강의 종료 요청하기
      const url = await mediaConverter.getAudioFileUrl(data.roomId);
      const response = await fetch((process.env.SERVER_API_URL + '/lecture/end') as string, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: data.roomId,
          audio: url
        })
      });
      console.log('response: ' + response.status);
    });

    socket.on('leave', (data) => {
      if (clientInfo.type !== ClientType.STUDENT || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 참여자가 존재하지 않습니다');
        return;
      }
      this._roomsConnectionInfo.get(clientInfo.roomId)?.exitRoom(clientConnectionInfo, data.roomId);
      this._io.of('/lecture').to(clientInfo.roomId).emit('response', new Message(data.type, 'success'));
    });
  };

  guestLecture = () => {};

  exchangeCandidate = (namespace: string, email: string, socket: Socket) => {
    try {
      const RTCPC = this._clientsConnectionInfo.get(email)?.RTCPC;
      if (!RTCPC) {
        console.log('candidate를 교환할 수 없습니다.');
        return;
      }
      RTCPC.onicecandidate = (e) => {
        if (e.candidate) {
          this._io.of(namespace).to(email).emit(`serverCandidate`, {
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
