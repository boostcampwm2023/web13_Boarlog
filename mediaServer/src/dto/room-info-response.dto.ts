import { convertBoardObjectToBuffer } from '../services/lecture.service';

export class RoomInfoResponseDto {
  private readonly _presenterEmail: string;
  private readonly _startTime: string;
  private readonly _currentWhiteboardData: Record<string, string | Buffer>;

  constructor({ presenterEmail, startTime, currentWhiteboardData }: Record<string, string>) {
    this._presenterEmail = presenterEmail;
    this._startTime = startTime;
    this._currentWhiteboardData = convertBoardObjectToBuffer(currentWhiteboardData);
  }

  get presenterEmail() {
    return this._presenterEmail;
  }

  get startTime() {
    return this._startTime;
  }

  get currentWhiteboardData() {
    return this._currentWhiteboardData;
  }
}
