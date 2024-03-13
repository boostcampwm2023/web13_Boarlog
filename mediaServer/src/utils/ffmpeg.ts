import { PeerStreamInfo } from '../models/PeerStreamInfo';
import ffmpeg from 'fluent-ffmpeg';
import { audioConfig } from '../config/ffmpeg.config';
import fs from 'fs';

const runFfmpegCommand = (
  audioTempFilePath: string,
  recordFilePath: string,
  roomId: string,
  streamInfo: PeerStreamInfo,
  endRecording: (roomId: string) => void
) => {
  ffmpeg(fs.createReadStream(audioTempFilePath))
    .addInputOptions(audioConfig)
    .format('mp3')
    .audioCodec('libmp3lame')
    .on('start', () => {
      console.log(`${roomId} 강의실 발표자 음성 파일 변환 시작`);
    })
    .on('error', (err) => {
      console.log(err);
    })
    .on('end', async () => {
      streamInfo.recordEnd = true;
      await endRecording(roomId);
      console.log(`${roomId} 강의실 발표자 음성 파일 변환 완료`);
    })
    .pipe(fs.createWriteStream(recordFilePath), { end: true });
};

export { runFfmpegCommand };
