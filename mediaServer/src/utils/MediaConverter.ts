import wrtc, { RTCAudioSink, RTCVideoSink } from 'wrtc';
import { PassThrough } from 'stream';
import fs from 'fs';
const { RTCAudioSink, RTCVideoSink } = wrtc.nonstandard;
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import { PeerStreamInfo } from '../models/PeerStreamInfo';
import { FfmpegCommand } from '../models/FfmpegCommand';
ffmpeg.setFfmpegPath(ffmpegPath.path);

class MediaConverter {
  private readonly peerStreamInfoList: Map<string, PeerStreamInfo>;

  constructor() {
    this.peerStreamInfoList = new Map();
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
  }

  setSink = (tracks: MediaStream, roomId: string) => {
    let videoSink: any;
    let audioSink: any;
    tracks.getTracks().forEach((track) => {
      if (track.kind === 'video') {
        videoSink = new RTCVideoSink(track);
      }
      if (track.kind === 'audio') {
        audioSink = new RTCAudioSink(track);
      }
    });
    this.startRecording(videoSink, audioSink, roomId);
  };

  startRecording = (videoSink: RTCVideoSink, audioSink: RTCAudioSink, roomId: string) => {
    videoSink.onframe = ({ frame: { width, height, data } }) => {
      if (!this.peerStreamInfoList.has(roomId)) {
        const streamInfo = new PeerStreamInfo(videoSink, audioSink, roomId, `${width}x${height}`);
        this.peerStreamInfoList.set(roomId, streamInfo);
        audioSink.ondata = ({ samples: { buffer } }) => {
          this.pushAudioSample(stream, buffer);
        };
      }
      const stream = this.peerStreamInfoList.get(roomId) as PeerStreamInfo;
      this.pushVideoFrame(stream, data);
    };
  };

  pushVideoFrame = (streamInfo: PeerStreamInfo, buffer: ArrayBufferLike) => {
    if (!streamInfo.recordEnd) {
      streamInfo.video.push(Buffer.from(buffer));
    }
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
    this.mediaStreamToFile(streamInfo.video, streamInfo.videoTempFileName);
    this.mediaStreamToFile(streamInfo.audio, streamInfo.audioTempFileName);
    streamInfo.proc = new FfmpegCommand(
      this.getOutputAbsolutePath(streamInfo.videoTempFileName),
      this.getOutputAbsolutePath(streamInfo.audioTempFileName),
      this.getOutputAbsolutePath(streamInfo.recordFileName),
      streamInfo.videoSize,
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
    this.deleteTempFile(streamInfo.videoTempFileName);
    this.deleteTempFile(streamInfo.audioTempFileName);
    this.peerStreamInfoList.delete(roomId);
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
}

const outputDir = path.join(process.cwd(), 'output');
const mediaConverter = new MediaConverter();

export { outputDir, mediaConverter };
