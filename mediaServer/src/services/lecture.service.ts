import { ClientType } from '../constants/client-type.constant';
import { Socket } from 'socket.io';
import { ClientConnectionInfo } from '../models/ClientConnectionInfo';
import { RoomConnectionInfo } from '../models/RoomConnectionInfo';
import { relayServer } from '../main';
import { RECONNECT_TIMEOUT } from '../config/lecture.config';
import { endLecture } from './presenter.service';

const startLecture = (
  email: string,
  socket: Socket,
  clientInfo: Record<string, string>,
  clientConnectionInfo: ClientConnectionInfo,
  roomConnectionInfo: RoomConnectionInfo
) => {
  clientConnectionInfo.lectureSocket = socket;
  socket.join(clientInfo.roomId);
  if (clientInfo.type === ClientType.PRESENTER) {
    roomConnectionInfo.presenterSocket = socket;
    socket.join(email);
  }
  if (clientInfo.type === ClientType.STUDENT) {
    roomConnectionInfo.participantIdList.add(email);
    fetch((process.env.SERVER_API_URL + '/lecture/' + clientInfo.roomId) as string, {
      method: 'PATCH',
      headers: { Authorization: socket.handshake.auth.accessToken }
    }).then((response) => console.log('강의 시작:' + response.status));
  }
};

const scheduleEndLecture = (roomId: string, presenterId: string) => {
  const timerId = setTimeout(
    async () => {
      await endLecture(roomId, presenterId);
      relayServer.scheduledEndLectureList.delete(roomId);
    },
    RECONNECT_TIMEOUT,
    roomId,
    presenterId
  );
  relayServer.scheduledEndLectureList.set(roomId, timerId);
};

export { startLecture, scheduleEndLecture };
