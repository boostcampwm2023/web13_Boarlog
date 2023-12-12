import ffmpeg from 'fluent-ffmpeg';
import { audioConfig } from '../config/ffmpeg.config';
import { PeerStreamInfo } from './PeerStreamInfo';

export class FfmpegCommand {
  private readonly _command: ffmpeg.FfmpegCommand;

  constructor(
    audioTempFilePath: string,
    recordFilePath: string,
    roomId: string,
    streamInfo: PeerStreamInfo,
    endRecording: (roomId: string) => void
  ) {
    this._command = ffmpeg()
      .addInput(audioTempFilePath)
      .addInputOptions(audioConfig)
      .on('start', () => {
        console.log(`${roomId} 강의실 음성 녹화 시작`);
      })
      .on('end', async () => {
        streamInfo.recordEnd = true;
        endRecording(roomId);
        console.log(`${roomId} 강의실 음성 녹화 종료`);
      })
      .output(recordFilePath);
  }

  run = () => {
    this._command.run();
  };
}
