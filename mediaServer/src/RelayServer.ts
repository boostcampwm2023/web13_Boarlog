import { Server, Socket } from 'socket.io';
import { RTCIceCandidate, RTCPeerConnection } from 'wrtc';

export class RelayServer {
  private readonly io;
  private relayServerRTCPC: RTCPeerConnection;
  private readonly socketToRoom: Map<string, string>;
  // 접속한 user의 RTCPeerConnection
  private readonly receiveStreamRTCPC: Map<string, RTCPeerConnection>;
  // receiveStreamRTCPC에서 받은 MediaStream 저장
  private readonly mediaStreams: Map<string, Array<{ id: string; stream: MediaStream }>>;

  constructor(port: number) {
    this.relayServerRTCPC = new RTCPeerConnection();
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
    try {
      socket.on('presenterOffer', async (data) => {
        const RTCPC = new RTCPeerConnection();
        this.relayServerRTCPC = RTCPC;
        RTCPC.ontrack = (event) => {
          RTCPC.getTransceivers().forEach((receiver) => {
            console.log(receiver);
          });
          const stream = event.streams[0];
          console.log(stream);
        };

        this.getServerCandidate(socket, data.socketId);

        await RTCPC.setRemoteDescription(data.SDP).then(() => console.log('sever remote description 설정 완료'));
        const SDP = await RTCPC.createAnswer();
        socket.emit(`${data.socketId}-serverAnswer`, {
          SDP: SDP
        });
        RTCPC.setLocalDescription(SDP);
        console.log(RTCPC);
      });
    } catch (e) {
      console.log(e);
    }
  };

  getServerCandidate = (socket: Socket, presenterSocketId: string) => {
    try {
      this.relayServerRTCPC.onicecandidate = (e) => {
        if (e.candidate) {
          console.log('서버의 candidate 수집');
          socket.emit(`${presenterSocketId}-serverCandidate`, {
            candidate: e.candidate
          });
        }
      };
      socket.on('presenterCandidate', (data) => {
        this.relayServerRTCPC
          .addIceCandidate(new RTCIceCandidate(data.candidate))
          .then(() => console.log('발표자로부터 candidate 받음'));
      });
    } catch (e) {
      console.log(e);
    }
  };
}
