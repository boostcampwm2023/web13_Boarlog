import wrtc, { RTCAudioSink } from 'wrtc';
import { PassThrough } from 'stream';
import fs from 'fs';
const { RTCAudioSink } = wrtc.nonstandard;
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import { PeerStreamInfo } from '../models/PeerStreamInfo';
import { FfmpegCommand } from '../models/FfmpegCommand';
import { uploadFileToObjectStorage } from './ncp-storage';
ffmpeg.setFfmpegPath(ffmpegPath.path);

class MediaConverter {
  private readonly peerStreamInfoList: Map<string, PeerStreamInfo>;
  private audioURL: string | undefined;

  constructor() {
    this.peerStreamInfoList = new Map();
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    this.audioURL = '';
  }

  setSink = (tracks: MediaStream, roomId: string) => {
    let audioSink: any;
    tracks.getTracks().forEach((track) => {
      if (track.kind === 'audio') {
        audioSink = new RTCAudioSink(track);
      }
    });
    this.startRecording(audioSink, roomId);
  };

  startRecording = (audioSink: RTCAudioSink, roomId: string) => {
    audioSink.ondata = ({ samples: { buffer } }) => {
      if (!this.peerStreamInfoList.has(roomId)) {
        this.peerStreamInfoList.set(roomId, new PeerStreamInfo(audioSink, roomId));
      }
      const stream = this.peerStreamInfoList.get(roomId) as PeerStreamInfo;
      this.pushAudioSample(stream, buffer);
    };
  };

  pushAudioSample = (streamInfo: PeerStreamInfo, buffer: ArrayBufferLike) => {
    if (!streamInfo.recordEnd) {
      streamInfo.audio.push(Buffer.from(buffer));
    }
  };

  setFfmpeg = (roomId: string): void => {
    const streamInfo = this.peerStreamInfoList.get(roomId);
    if (!streamInfo) {
      console.log('해당 강의실 발표자가 존재하지 않습니다.');
      return;
    }
    this.mediaStreamToFile(streamInfo.audio, streamInfo.audioTempFileName);
    streamInfo.proc = new FfmpegCommand(
      this.getOutputAbsolutePath(streamInfo.audioTempFileName),
      this.getOutputAbsolutePath(streamInfo.recordFileName),
      roomId,
      streamInfo,
      this.endRecording
    );
    streamInfo.proc.run();
  };

  mediaStreamToFile = (stream: PassThrough, fileName: string): string => {
    const outputPath = path.join(outputDir, fileName);
    const outputFile = fs.createWriteStream(outputPath);
    stream.pipe(outputFile);
    return outputPath;
  };

  endRecording = (roomId: string) => {
    const streamInfo = this.peerStreamInfoList.get(roomId);
    if (!streamInfo) {
      console.log('해당 강의실 발표자가 존재하지 않습니다.');
      return;
    }
    streamInfo.stopRecording();
    this.deleteTempFile(streamInfo.audioTempFileName);
    this.peerStreamInfoList.delete(roomId);

    this.requestToServer(roomId);
  };

  getOutputAbsolutePath = (fileName: string) => {
    return path.join(outputDir, fileName);
  };

  deleteTempFile = (tempFileName: string) => {
    fs.unlink(path.join(outputDir, tempFileName), (err) => {
      if (err) {
        console.log(`${tempFileName}을 찾을 수 없습니다.`);
      }
    });
  };

  saveAudioFile = async (roomId: string) => {
    const streamInfo = this.peerStreamInfoList.get(roomId);
    if (!streamInfo) {
      console.log('해당 강의실 발표자가 존재하지 않습니다.');
      return;
    }
    const url = await uploadFileToObjectStorage(streamInfo.recordFileName, roomId);
    console.log(`${url}에 파일 저장`);
    return url;
  };

  requestToServer = async (roomId: string) => {
    // TODO: API 서버에 강의 종료 요청하기
    const url = await this.saveAudioFile(roomId);
    const response = await fetch((process.env.SERVER_API_URL + '/lecture/end') as string, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: roomId,
        audio: url
      })
    });
    console.log('response: ' + response.status);
  };
}

const outputDir = path.join(process.cwd(), 'output');
const mediaConverter = new MediaConverter();

export { outputDir, mediaConverter };
