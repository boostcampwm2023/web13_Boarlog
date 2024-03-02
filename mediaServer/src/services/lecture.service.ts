import { ClientType } from '../constants/client-type.constant';
import { Socket } from 'socket.io';
import { ClientConnectionInfo } from '../models/ClientConnectionInfo';
import { RoomConnectionInfo } from '../models/RoomConnectionInfo';

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
    roomConnectionInfo.studentInfoList.add(clientConnectionInfo);
    fetch((process.env.SERVER_API_URL + '/lecture/' + clientInfo.roomId) as string, {
      method: 'PATCH',
      headers: { Authorization: socket.handshake.auth.accessToken }
    }).then((response) => console.log('강의 시작:' + response.status));
  }
};

export { startLecture };
