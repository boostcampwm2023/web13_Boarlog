import { Socket } from 'socket.io';
import { askQuestion, enterAsGuest, getClientEmail, leaveRoom } from '../services/participant.service';
import { findClientInfoByEmail } from '../repositories/client.repsitory';
import { findRoomInfoById } from '../repositories/room.repository';
import { ClientType } from '../constants/client-type.constant';
import { editWhiteboard, endLecture } from '../services/presenter.service';
import { updateQuestionStatus } from '../repositories/question-repository';
import { relayServer } from '../main';
import { startLecture } from '../services/lecture.service';

export class LectureListener {
  // TODO: 클라이언트는 한 개의 방만 접속할 수 있는지? 만약 그렇다면, 이미 참여 중인 빙이 있을 때 요청 거부하도록 처리해야 함
  lecture = async (socket: Socket) => {
    const email = getClientEmail(socket);
    if (!email) {
      await enterAsGuest(socket);
      return;
    }
    const clientInfo = await findClientInfoByEmail(email);
    const clientConnectionInfo = await relayServer.clientsConnectionInfo.get(email);
    if (!clientInfo || !clientConnectionInfo || !clientInfo.roomId) {
      // TODO: 추후 클라이언트로 에러처리 필요
      console.log('잘못된 요청입니다.');
      return;
    }
    const roomInfo = await findRoomInfoById(clientInfo.roomId);
    const roomConnectionInfo = relayServer.roomsConnectionInfo.get(clientInfo.roomId);
    if (!roomConnectionInfo) {
      // TODO: 추후 클라이언트로 에러처리 필요
      console.log('아직 열리지 않았거나 종료된 방입니다.');
      return;
    }
    startLecture(email, socket, clientInfo, clientConnectionInfo, roomConnectionInfo);

    socket.on('edit', async (data) => {
      if (clientInfo.type !== ClientType.PRESENTER || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 발표자가 존재하지 않습니다.');
        return;
      }
      await editWhiteboard(data.roomId, data.content);
    });

    socket.on('ask', async (data) => {
      if (clientInfo.type !== ClientType.STUDENT || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 참여자가 존재하지 않습니다.');
        return;
      }
      await askQuestion(roomInfo.presenterEmail, data.roomId, data.content);
    });

    socket.on('solved', async (data) => {
      if (clientInfo.type !== ClientType.PRESENTER || clientInfo.roomId !== data.roomId) {
        console.log('해당 강의실 발표자만 질문을 완료할 수 있습니다.');
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
      if (clientInfo.type !== ClientType.PRESENTER || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 발표자가 존재하지 않습니다');
        return;
      }
      await endLecture(clientInfo.roomId, email);
    });

    socket.on('leave', (data) => {
      if (clientInfo.type !== ClientType.STUDENT || clientInfo.roomId !== data.roomId) {
        // TODO: 추후 클라이언트로 에러처리 필요
        console.log('해당 참여자가 존재하지 않습니다');
        return;
      }
      leaveRoom(clientInfo.roomId, clientConnectionInfo);
    });
  };
}
