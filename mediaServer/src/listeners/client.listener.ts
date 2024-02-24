import { Socket } from 'socket.io';
import { getClientIdAndClientType } from '../services/participant.service';
import { saveClientInfo } from '../repositories/client.repsitory';
import { findRoomInfoById } from '../repositories/room.repository';
import { ClientConnectionInfo } from '../models/ClientConnectionInfo';
import { relayServer } from '../main';
import { getEmailByJwtPayload } from '../utils/auth';
import { isCreatedRoomAndNotEqualPresenterEmail } from '../validation/request.validation';
import { RTCPeerConnection } from 'wrtc';
import { pc_config } from '../config/pc.config';
import { isReconnectPresenter, sendPrevLectureData, setPresenterConnection } from '../services/presenter.service';
import { setParticipantWebRTCConnection, setPresenterWebRTCConnection } from '../services/webrtc-connection.service';

export class ClientListener {
  createRoom = (socket: Socket) => {
    try {
      const email: string = getEmailByJwtPayload(socket.handshake.auth.accessToken);
      if (relayServer.clientsConnectionInfo.has(email)) {
        // TODO: 이미 참여 중인 방이 있을 때, 클라이언트한테 재 참여할건지 물어보기. 아니면 한 강의실만 참여할 수 있다고 해도 좋음
      }
      socket.on('presenterOffer', async (data) => {
        const RTCPC = new RTCPeerConnection(pc_config);
        const roomInfo = await findRoomInfoById(data.roomId);
        if (isCreatedRoomAndNotEqualPresenterEmail(email, roomInfo)) {
          console.log('이미 존재하는 강의실입니다.');
          return;
        }
        socket.join(email);
        relayServer.clientsConnectionInfo.set(email, new ClientConnectionInfo(RTCPC, socket));
        if (isReconnectPresenter(roomInfo.presenterEmail, email)) {
          await sendPrevLectureData(data.roomId, email, roomInfo);
        } else {
          await setPresenterConnection(data.roomId, email, RTCPC, data.whiteboard);
        }
        await setPresenterWebRTCConnection(data.roomId, email, RTCPC, socket, data.SDP);
      });
    } catch (e) {
      console.log(e);
    }
  };

  enterRoom = (socket: Socket) => {
    try {
      const { clientId, clientType } = getClientIdAndClientType(socket);
      socket.on('studentOffer', async (data) => {
        const RTCPC = new RTCPeerConnection(pc_config);
        socket.join(clientId);
        await saveClientInfo(clientId, clientType, data.roomId);
        relayServer.clientsConnectionInfo.set(clientId, new ClientConnectionInfo(RTCPC, socket));
        const roomInfo = await findRoomInfoById(data.roomId);
        if (!roomInfo.currentWhiteboardData) {
          console.log('정상적인 접근이 아닙니다');
          return;
        }
        await setParticipantWebRTCConnection(data.roomId, clientId, RTCPC, roomInfo, socket, data.SDP);
      });
    } catch (e) {
      console.log(e);
    }
  };
}
