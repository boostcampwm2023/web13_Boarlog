import wrtc, { RTCAudioSink, RTCVideoSink } from 'wrtc';
import { PassThrough } from 'stream';
import fs from 'fs';
const { RTCAudioSink, RTCVideoSink } = wrtc.nonstandard;
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { audioConfig, videoConfig } from '../config/ffmpeg.config';
import path from 'path';
ffmpeg.setFfmpegPath(ffmpegPath.path);

interface PeerSink {
  videoSink: RTCVideoSink;
  audioSink: RTCAudioSink;
}

interface PeerStream {
  recordPath: string;
  size: string;
  video: PassThrough;
  audio: PassThrough;
  end: boolean;
  recordEnd: boolean;
  proc?: ffmpeg.FfmpegCommand;
}

const outputDir = path.join(process.cwd(), 'output');

class MediaConverter {
  private readonly peerStreams: Map<string, PeerStream>;
  private readonly peerSinks: Map<string, PeerSink>;

  constructor() {
    this.peerStreams = new Map();
    this.peerSinks = new Map();
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
      const videoSize = `${width}x${height}`;
      if (!this.peerStreams.has(roomId)) {
        const stream = {
          recordPath: `lecture-${roomId}.mp4`,
          size: videoSize,
          video: new PassThrough(),
          audio: new PassThrough(),
          end: false,
          recordEnd: false,
          proc: ffmpeg()
        };
        this.peerStreams.set(roomId, stream);
        audioSink.ondata = ({ samples: { buffer } }) => {
          this.pushData(stream, buffer);
        };
      }
      const stream = this.peerStreams.get(roomId) as PeerStream;
      stream.video.push(Buffer.from(data));
    };
  };

  pushData = (stream: PeerStream, buffer: ArrayBufferLike) => {
    if (!stream.end) {
      stream.audio.push(Buffer.from(buffer));
    }
  };

  setFfmpeg = (roomId: string, videoSize: string): void => {
    const stream = this.peerStreams.get(roomId) as PeerStream;
    const videoPath = this.mediaStreamToFile(stream.video, `video-${roomId}`);
    const audioPath = this.mediaStreamToFile(stream.audio, `audio-${roomId}`);
    const proc = ffmpeg()
      .addInput(videoPath)
      .addInputOptions(videoConfig('640x480'))
      .addInput(audioPath)
      .addInputOptions(audioConfig)
      .on('start', () => {
        console.log(`${roomId} 강의실 영상 녹화 시작`);
      })
      .on('end', () => {
        stream.recordEnd = true;
        this.endRecording(roomId);
        console.log(`${roomId} 강의실 영상 녹화 종료`);
      })
      .size(videoSize)
      .output(path.join(outputDir, stream.recordPath));
    proc.run();
  };

  mediaStreamToFile = (stream: PassThrough, fileName: string): string => {
    const outputPath = path.join(outputDir, `${fileName}.sock`);
    const outputFile = fs.createWriteStream(outputPath);
    stream.pipe(outputFile);
    return outputPath;
  };

  endRecording = (roomId: string) => {
    const stream = this.peerStreams.get(roomId);
    const sinkList = this.peerSinks.get(roomId);
    if (!stream && !sinkList) {
      return;
    }
    fs.unlink(path.join(outputDir, `video-${roomId}.sock`), (err) => {
      if (err) {
        console.log(`video-${roomId}.sock을 찾을 수 없습니다.`);
      }
    });
    fs.unlink(path.join(outputDir, `audio-${roomId}.sock`), (err) => {
      if (err) {
        console.log(`audio-${roomId}.sock을 찾을 수 없습니다.`);
      }
    });
    sinkList?.videoSink.stop();
    sinkList?.audioSink.stop();
    stream?.video.end();
    stream?.audio.end();
    this.peerStreams.delete(roomId);
    this.peerSinks.delete(roomId);
  };
}

export const mediaConverter = new MediaConverter();
