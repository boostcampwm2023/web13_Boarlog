import { PassThrough } from 'stream';
import { FfmpegCommand } from './FfmpegCommand';
import { RTCAudioSink, RTCVideoSink } from 'wrtc';

interface MediaFileNameList {
  videoTempFile: string;
  audioTempFile: string;
  recordFile: string;
}

interface SinkList {
  videoSink: RTCVideoSink;
  audioSink: RTCAudioSink;
}

export class PeerStreamInfo {
  private readonly _sinkList: SinkList;
  private readonly _mediaFileNameList: MediaFileNameList;
  private readonly _videoSize: string;
  private readonly _video: PassThrough;
  private readonly _audio: PassThrough;
  private _recordEnd: boolean;
  private _proc: FfmpegCommand | null;

  constructor(videoSink: RTCVideoSink, audioSink: RTCAudioSink, roomId: string, videoSize: string) {
    this._sinkList = this.setSinks(videoSink, audioSink);
    this._mediaFileNameList = this.setFileName(roomId);
    this._videoSize = videoSize;
    this._video = new PassThrough();
    this._audio = new PassThrough();
    this._recordEnd = false;
    this._proc = null;
  }

  get videoTempFileName(): string {
    return this._mediaFileNameList.videoTempFile;
  }

  get audioTempFileName(): string {
    return this._mediaFileNameList.audioTempFile;
  }

  get recordFileName(): string {
    return this._mediaFileNameList.recordFile;
  }

  get videoSize(): string {
    return this._videoSize;
  }

  get video(): PassThrough {
    return this._video;
  }

  get audio(): PassThrough {
    return this._audio;
  }

  set recordEnd(isRecordEnd: boolean) {
    this._recordEnd = isRecordEnd;
  }

  get proc(): FfmpegCommand | null {
    return this._proc;
  }

  set proc(FfmpegCommand: FfmpegCommand) {
    this._proc = FfmpegCommand;
  }

  setSinks = (videoSink: RTCVideoSink, audioSink: RTCAudioSink): SinkList => {
    return {
      videoSink: videoSink,
      audioSink: audioSink
    };
  };

  setFileName = (roomId: string): MediaFileNameList => {
    return {
      videoTempFile: `video-${roomId}.sock`,
      audioTempFile: `audio-${roomId}.sock`,
      recordFile: `lecture-${roomId}.mp4`
    };
  };

  stopRecording() {
    this._sinkList.videoSink.stop();
    this._sinkList.audioSink.stop();
    this._video.end();
    this._audio.end();
  }
}
