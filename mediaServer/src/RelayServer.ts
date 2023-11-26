import { Server, Socket } from 'socket.io';
import { RTCIceCandidate, RTCPeerConnection } from 'wrtc';

export class RelayServer {
  private readonly io;
  private relayServerRTCPC: RTCPeerConnection;
  private readonly studentRTCPCs: Map<string, RTCPeerConnection>;
  private presenterStream: any;

  constructor(port: number) {
    this.relayServerRTCPC = new RTCPeerConnection();
    this.studentRTCPCs = new Map();
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
        const RTCPC = new RTCPeerConnection();
        this.relayServerRTCPC = RTCPC;

        RTCPC.ontrack = (event) => {
          const stream = event.streams[0];
          this.presenterStream = stream;
        };

        this.getServerCandidate(socket, data.socketId);

        await RTCPC.setRemoteDescription(data.SDP);
        const SDP = await RTCPC.createAnswer();
        socket.emit(`${data.socketId}-serverAnswer`, {
          isStudent: false,
          SDP: SDP
        });
        RTCPC.setLocalDescription(SDP);
      });
    } catch (e) {
      console.log(e);
    }
  };

  enterRoom = (socket: Socket) => {
    try {
      socket.on('studentOffer', async (data) => {
        const socketId = data.socketId;
        const RTCPC = new RTCPeerConnection();

        this.presenterStream.getTracks().forEach((track: any) => {
          RTCPC.addTrack(track);
        });

        this.studentRTCPCs.set(socketId, RTCPC);

        this.exchangeCandidate(socket, socketId);

        await RTCPC.setRemoteDescription(data.SDP);
        const SDP = await RTCPC.createAnswer();
        socket.emit(`${data.socketId}-serverAnswer`, {
          isStudent: true,
          SDP: SDP
        });
        RTCPC.setLocalDescription(SDP);
      });
    } catch (e) {
      console.log(e);
    }
  };

  getServerCandidate = (socket: Socket, presenterSocketId: string) => {
    try {
      this.relayServerRTCPC.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit(`${presenterSocketId}-serverCandidate`, {
            candidate: e.candidate
          });
        }
      };
      socket.on('presenterCandidate', (data) => {
        this.relayServerRTCPC.addIceCandidate(new RTCIceCandidate(data.candidate));
      });
    } catch (e) {
      console.log(e);
    }
  };

  exchangeCandidate = (socket: Socket, socketId: any) => {
    try {
      const RTCPC = this.studentRTCPCs.get(socketId);
      if (RTCPC) {
        RTCPC.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit(`${socketId}-serverCandidate`, {
              candidate: e.candidate
            });
          }
        };
      }
      socket.on('studentCandidate', (data) => {
        RTCPC?.addIceCandidate(new RTCIceCandidate(data.candidate));
      });
    } catch (e) {
      console.log(e);
    }
  };
}
