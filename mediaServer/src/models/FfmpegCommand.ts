import ffmpeg from 'fluent-ffmpeg';
import { audioConfig, videoConfig } from '../config/ffmpeg.config';
import { uploadFileToObjectStorage } from '../utils/ncp-storage';
import { PeerStreamInfo } from './PeerStreamInfo';

export class FfmpegCommand {
  private readonly _command: ffmpeg.FfmpegCommand;

  constructor(
    videoTempFilePath: string,
    audioTempFilePath: string,
    recordFilePath: string,
    videoSize: string,
    roomId: string,
    streamInfo: PeerStreamInfo,
    endRecording: (roomId: string) => void
  ) {
    this._command = ffmpeg()
      .addInput(videoTempFilePath)
      .addInputOptions(videoConfig(videoSize))
      .addInput(audioTempFilePath)
      .addInputOptions(audioConfig)
      .on('start', () => {
        console.log(`${roomId} 강의실 영상 녹화 시작`);
      })
      .on('end', async () => {
        streamInfo.recordEnd = true;
        endRecording(roomId);
        console.log(`${roomId} 강의실 영상 녹화 종료`);

        const url = await uploadFileToObjectStorage(recordFilePath, roomId);
        console.log(`${url}에 파일 저장`);

        fetch(process.env.SERVER_API_URL as string, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: roomId,
            audio: url
          })
        });
      })
      .size(videoSize)
      .output(recordFilePath);
  }

  run = () => {
    this._command.run();
  };
}
