import { RoomConnectionInfo } from '../models/RoomConnectionInfo';
import { DisconnectReason } from 'socket.io';

const canEnterLecture = (roomConnectionInfo: RoomConnectionInfo | undefined) => {
  if (roomConnectionInfo) {
    return true;
  }
  // TODO: 추후 클라이언트로 에러처리 필요
  console.log('아직 열리지 않았거나 종료된 방입니다.');
  return false;
};

const hasCurrentBoardDataInLecture = (currentBoardData: string) => {
  if (currentBoardData) {
    return true;
  }
  console.log('정상적인 접근이 아닙니다');
  return false;
};

const isLectureOngoing = (reason: DisconnectReason) => {
  return reason != 'server namespace disconnect';
};

export { canEnterLecture, hasCurrentBoardDataInLecture, isLectureOngoing };
