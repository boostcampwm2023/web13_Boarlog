import { Server, Socket } from 'socket.io';
import { RTCIceCandidate, RTCPeerConnection } from 'wrtc';
import { pc_config } from './pc.config';
import { RoomInfo } from './RoomInfo';

export class RelayServer {
  private readonly io;
  private readonly roomsInfo: Map<string, RoomInfo>;
  private readonly clientRTCPCs: Map<string, RTCPeerConnection>;

  constructor(port: number) {
    this.roomsInfo = new Map();
    this.clientRTCPCs = new Map();
    this.io = new Server(port, {
      cors: {
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
      socket.on('presenterOffer', async (data) => {
        const RTCPC = new RTCPeerConnection(pc_config);
        this.clientRTCPCs.set(socket.id, RTCPC);
        this.roomsInfo.set(data.roomId, new RoomInfo(socket.id, RTCPC));
        RTCPC.ontrack = (event) => {
          const roomInfo = this.roomsInfo.get(data.roomId);
          if (roomInfo) {
            roomInfo.stream = event.streams[0];
          }
        };

        socket.join(socket.id);
        this.exchangeCandidate('/create-room', socket);

        await RTCPC.setRemoteDescription(data.SDP);
        const SDP = await RTCPC.createAnswer();
        this.io.of('/create-room').to(socket.id).emit('serverAnswer', {
          SDP: SDP
        });
        RTCPC.setLocalDescription(SDP);

        socket.join(data.roomId);
      });
    } catch (e) {
      console.log(e);
    }
  };

  enterRoom = (socket: Socket) => {
    try {
      socket.on('studentOffer', async (data) => {
        const RTCPC = new RTCPeerConnection(pc_config);
        this.clientRTCPCs.set(socket.id, RTCPC);
        const presenterStream = this.roomsInfo.get(data.roomId)?.stream;
        if (!presenterStream) {
          return;
        }
        presenterStream.getTracks().forEach((track: any) => {
          RTCPC.addTrack(track);
        });

        socket.join(socket.id);
        this.exchangeCandidate('/enter-room', socket);

        await RTCPC.setRemoteDescription(data.SDP);
        const SDP = await RTCPC.createAnswer();
        this.io.of('/enter-room').to(socket.id).emit(`serverAnswer`, {
          SDP: SDP
        });
        RTCPC.setLocalDescription(SDP);

        socket.join(data.roomId);
      });
    } catch (e) {
      console.log(e);
    }
  };

  exchangeCandidate = (namespace: string, socket: Socket) => {
    try {
      const RTCPC = this.clientRTCPCs.get(socket.id);
      if (RTCPC) {
        RTCPC.onicecandidate = (e) => {
          if (e.candidate) {
            this.io.of(namespace).to(socket.id).emit(`serverCandidate`, {
              candidate: e.candidate
            });
          }
        };
      }
      socket.on('clientCandidate', (data) => {
        RTCPC?.addIceCandidate(new RTCIceCandidate(data.candidate));
      });
    } catch (e) {
      console.log(e);
    }
  };
}
