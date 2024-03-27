import { Socket } from 'socket.io';
import { getClientIdAndClientType } from '../services/participant.service';
import { saveClientInfo } from '../repositories/client.repsitory';
import { findRoomInfoById, saveRoomInfo } from '../repositories/room.repository';
import { ClientConnectionInfo } from '../models/ClientConnectionInfo';
import { relayServer } from '../main';
import { getEmailByJwtPayload } from '../utils/auth';
import { isNotEqualPresenterEmail, isReconnectPresenter } from '../validation/client.validation';
import { RTCPeerConnection } from 'wrtc';
import { pc_config } from '../config/pc.config';
import {
  sendPrevLectureData,
  setPresenterConnection,
  updatePresenterConnectionInfo
} from '../services/presenter.service';
import { setParticipantWebRTCConnection, setPresenterWebRTCConnection } from '../services/webrtc-connection.service';
import { canEnterRoom } from '../validation/lecture.validation';
import { ClientStatus } from '../constants/client-status.constant';
import { RoomInfoRequestDto } from '../dto/room-info-request.dto';

export class ClientListener {
  createRoom = (socket: Socket) => {
    try {
      // TODO: 이미 참여 중인 방이 있을 때, 클라이언트한테 재 참여할건지 물어보기. 아니면 한 강의실만 참여할 수 있다고 해도 좋음
      const email: string = getEmailByJwtPayload(socket.handshake.auth.accessToken);
      socket.on('presenterOffer', async (data) => {
        const RTCPC = new RTCPeerConnection(pc_config);
        const roomInfo = await findRoomInfoById(data.roomId);
        if (isNotEqualPresenterEmail(email, roomInfo)) {
          return;
        }
        socket.join(email);
        if (isReconnectPresenter(roomInfo.presenterEmail, email)) {
          relayServer.clearScheduledEndLecture(data.roomId);
          updatePresenterConnectionInfo(email, RTCPC, socket);
          await sendPrevLectureData(data.roomId, email, roomInfo);
        } else {
          await setPresenterConnection(data.roomId, email, RTCPC, socket);
        }
        await setPresenterWebRTCConnection(data.roomId, email, RTCPC, socket, data.SDP);
      });
      socket.on('whiteboardInit', async (data) => {
        const clientConnectionInfo = relayServer.clientConnectionInfoList.get(email);
        if (clientConnectionInfo && clientConnectionInfo.status == ClientStatus.OFFLINE) {
          clientConnectionInfo.setOnlineStatus();
          return;
        }
        saveRoomInfo(data.roomId, new RoomInfoRequestDto(email, data.whiteboardDetails));
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
        relayServer.clientConnectionInfoList.set(clientId, new ClientConnectionInfo(RTCPC, socket));
        const roomInfo = await findRoomInfoById(data.roomId);
        if (!canEnterRoom(roomInfo)) {
          return;
        }
        await setParticipantWebRTCConnection(data.roomId, clientId, RTCPC, roomInfo, socket, data.SDP);
      });
    } catch (e) {
      console.log(e);
    }
  };
}
