import { Server, Socket } from 'socket.io';
import { RTCIceCandidate, RTCPeerConnection } from 'wrtc';

const pc_config = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302'
      ]
    }
  ]
};

export class RelayServer {
  private readonly io;
  private readonly socketToRoom: Map<string, string>;
  // 접속한 user의 RTCPeerConnection
  private readonly receiveStreamRTCPC: Map<string, RTCPeerConnection>;
  // receiveStreamRTCPC에서 받은 MediaStream 저장
  private readonly mediaStreams: Map<string, Array<{ id: string; stream: MediaStream }>>;

  constructor(port: number) {
    this.socketToRoom = new Map();
    this.receiveStreamRTCPC = new Map();
    this.mediaStreams = new Map();
    this.io = new Server(port, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
  }

  listen = (path: string, event: string, method: (socket: Socket) => void) => {
    // TODO: API 서버를 통해 인증 과정을 거친다.
    this.io.of(path).on(event, method);
  };

  createRoom = (socket: Socket) => {
    socket.on('presenterOffer', async (data) => {
      try {
        this.socketToRoom.set(data.presenterSocketId, data.roomId);
        const RTCPC = this.createReceiveStreamRTCPC(data.presenterSocketId, socket, data.roomId);
        console.log('1. 발표자로 부터 SDP 받음. SDP 출력');
        console.log(data.sdp);
        await RTCPC.setRemoteDescription(data.sdp);
        const sdp = await RTCPC.createAnswer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        await RTCPC.setLocalDescription(sdp);
        socket.emit(data.presenterSocketId, {
          sdp: sdp
        });
      } catch (err) {
        console.log(err);
      }
    });
    socket.on('presenterCandidate', async (data) => {
      try {
        const RTCPC = this.receiveStreamRTCPC.get(data.presenterSocketId) as RTCPeerConnection;
        console.log('2. 발표자의 candidate 추가');
        await RTCPC.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (e) {
        console.log(e);
      }
    });
  };

  private createReceiveStreamRTCPC = (socketId: string, socket: Socket, roomId: string): RTCPeerConnection => {
    const RTCPC = new RTCPeerConnection(pc_config);
    this.receiveStreamRTCPC.set(socketId, RTCPC);
    RTCPC.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('3. candidate 생성완료. candidate 출력');
        console.log(e.candidate);
        socket.emit(`${socketId}-serverCandidate`, {
          candidate: e.candidate
        });
      }
    };
    try {
      RTCPC.oniceconnectionstatechange = (e) => console.log(e);
      RTCPC.ontrack = (e) => {
        console.log(e.streams);
        if (this.mediaStreams.has(roomId)) {
          if (!this.mediaStreams.get(roomId)?.some((mediaStream) => mediaStream.id === socketId)) {
            this.mediaStreams.get(roomId)?.push({
              id: socketId,
              stream: e.streams[0]
            });
          } else {
            return;
          }
        } else {
          this.mediaStreams.set(roomId, [
            {
              id: socketId,
              stream: e.streams[0]
            }
          ]);
        }
        socket.broadcast.to(roomId).emit('userEnter', { id: socketId });
      };
    } catch (err) {
      console.log('[ERR] !!');
      console.log(err);
    }
    return RTCPC;
  };
}
