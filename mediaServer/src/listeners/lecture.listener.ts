import { Socket } from 'socket.io';
import { askQuestion, getClientEmail, leaveRoom } from '../services/participant.service';
import { findClientInfoByEmail } from '../repositories/client.repsitory';
import { findRoomInfoById } from '../repositories/room.repository';
import { editWhiteboard, endLecture } from '../services/presenter.service';
import { updateQuestionStatus } from '../repositories/question-repository';
import { relayServer } from '../main';
import { scheduleEndLecture, startLecture } from '../services/lecture.service';
import { isGuest, isParticipant, isParticipatingClient, isPresenter } from '../validation/client.validation';
import { ClientConnectionInfo } from '../models/ClientConnectionInfo';
import { RoomConnectionInfo } from '../models/RoomConnectionInfo';
import { canEnterLecture, isLectureOngoing } from '../validation/lecture.validation';
import { mediaConverter } from '../utils/media-converter';

export class LectureListener {
  // TODO: 클라이언트는 한 개의 방만 접속할 수 있는지? 만약 그렇다면, 이미 참여 중인 빙이 있을 때 요청 거부하도록 처리해야 함
  enterLecture = async (socket: Socket) => {
    const email = getClientEmail(socket);
    if (!email) {
      await this.enterLectureAsGuest(socket);
      return;
    }
    const clientInfo = await findClientInfoByEmail(email);
    const clientConnectionInfo = (await relayServer.clientConnectionInfoList.get(email)) as ClientConnectionInfo;
    if (!isParticipatingClient(email, clientInfo, clientInfo.roomId)) {
      return;
    }
    const roomInfo = await findRoomInfoById(clientInfo.roomId);
    const roomConnectionInfo = relayServer.roomConnectionInfoList.get(clientInfo.roomId) as RoomConnectionInfo;
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
      leaveRoom(clientInfo.roomId, email);
    });

    socket.on('disconnect', (reason) => {
      if (isPresenter(clientInfo.type, clientInfo.roomId, clientInfo.roomId) && isLectureOngoing(reason)) {
        scheduleEndLecture(clientInfo.roomId, email);
        const presenterStreamInfo = mediaConverter.getPresenterStreamInfo(clientInfo.roomId);
        if (!presenterStreamInfo) {
          console.log('존재하지 않는 강의실입니다.');
          return;
        }
        presenterStreamInfo.pauseRecording();
        clientConnectionInfo.setOfflineStatus();
        clientConnectionInfo.disconnectWebRTCConnection();
      }
      if (isParticipant(clientInfo.type, clientInfo.roomId, clientInfo.roomId)) {
        leaveRoom(clientInfo.roomId, email);
      }
    });
  };

  enterLectureAsGuest = async (socket: Socket) => {
    const clientId = socket.handshake.auth.accessToken;
    if (!clientId) {
      console.log('잘못 된 접근입니다.');
      return;
    }
    const clientInfo = await findClientInfoByEmail(clientId);
    const roomInfo = await findRoomInfoById(clientInfo.roomId);
    const roomConnectionInfo = relayServer.roomConnectionInfoList.get(clientInfo.roomId) as RoomConnectionInfo;
    if (!isParticipatingClient(clientId, clientInfo, clientInfo.roomId)) {
      return;
    }
    if (!canEnterLecture(roomConnectionInfo)) {
      return;
    }
    socket.join(clientInfo.roomId);
    roomConnectionInfo.participantIdList.add(clientId);

    socket.on('ask', async (data) => {
      if (!isGuest(clientInfo.type, clientInfo.roomId, data.roomId)) {
        return;
      }
      await askQuestion(roomInfo.presenterEmail, data.roomId, data.content);
    });

    socket.on('leave', (data) => {
      if (isParticipant(clientInfo.type, clientInfo.roomId, data.roomId)) {
        return;
      }
      leaveRoom(clientInfo.roomId, clientId);
    });

    socket.on('disconnect', () => {
      leaveRoom(clientInfo.roomId, clientId);
    });
  };
}
