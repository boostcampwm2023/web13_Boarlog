import { Socket } from 'socket.io';
import { askQuestion, enterAsGuest, getClientEmail, leaveRoom } from '../services/participant.service';
import { findClientInfoByEmail } from '../repositories/client.repsitory';
import { findRoomInfoById } from '../repositories/room.repository';
import { editWhiteboard, endLecture } from '../services/presenter.service';
import { updateQuestionStatus } from '../repositories/question-repository';
import { relayServer } from '../main';
import { startLecture } from '../services/lecture.service';
import { isParticipant, isParticipatingClient, isPresenter } from '../validation/client.validation';
import { ClientConnectionInfo } from '../models/ClientConnectionInfo';
import { RoomConnectionInfo } from '../models/RoomConnectionInfo';
import { canEnterLecture } from '../validation/lecture.validation';

export class LectureListener {
  // TODO: 클라이언트는 한 개의 방만 접속할 수 있는지? 만약 그렇다면, 이미 참여 중인 빙이 있을 때 요청 거부하도록 처리해야 함
  lecture = async (socket: Socket) => {
    const email = getClientEmail(socket);
    if (!email) {
      await enterAsGuest(socket);
      return;
    }
    const clientInfo = await findClientInfoByEmail(email);
    const clientConnectionInfo = (await relayServer.clientsConnectionInfo.get(email)) as ClientConnectionInfo;
    if (!isParticipatingClient(clientInfo, clientConnectionInfo, clientInfo.roomId)) {
      return;
    }
    const roomInfo = await findRoomInfoById(clientInfo.roomId);
    const roomConnectionInfo = relayServer.roomsConnectionInfo.get(clientInfo.roomId) as RoomConnectionInfo;
    if (!canEnterLecture(roomConnectionInfo)) {
      return;
    }
    startLecture(email, socket, clientInfo, clientConnectionInfo, roomConnectionInfo);

    socket.on('edit', async (data) => {
      if (!isPresenter(clientInfo.type, clientInfo.roomId, data.roomId)) {
        return;
      }
      await editWhiteboard(data.roomId, data.content);
    });

    socket.on('ask', async (data) => {
      if (isParticipant(clientInfo.type, clientInfo.roomId, data.roomId)) {
        return;
      }
      await askQuestion(roomInfo.presenterEmail, data.roomId, data.content);
    });

    socket.on('solved', async (data) => {
      if (!isPresenter(clientInfo.type, clientInfo.roomId, data.roomId)) {
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
      if (!isPresenter(clientInfo.type, clientInfo.roomId, data.roomId)) {
        return;
      }
      await endLecture(clientInfo.roomId, email);
    });

    socket.on('leave', (data) => {
      if (isParticipant(clientInfo.type, clientInfo.roomId, data.roomId)) {
        return;
      }
      leaveRoom(clientInfo.roomId, clientConnectionInfo);
    });
  };
}
