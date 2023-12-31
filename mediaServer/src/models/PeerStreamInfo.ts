import { PassThrough } from 'stream';
import { FfmpegCommand } from './FfmpegCommand';
import { RTCAudioSink } from 'wrtc';

interface MediaFileNameList {
  audioTempFile: string;
  recordFile: string;
}

export class PeerStreamInfo {
  private readonly _audioSink: RTCAudioSink;
  private readonly _mediaFileNameList: MediaFileNameList;
  private readonly _audio: PassThrough;
  private _recordEnd: boolean;
  private _proc: FfmpegCommand | null;

  constructor(audioSink: RTCAudioSink, roomId: string) {
    this._audioSink = audioSink;
    this._mediaFileNameList = this.setFileName(roomId);
    this._audio = new PassThrough();
    this._recordEnd = false;
    this._proc = null;
  }

  get audioTempFileName(): string {
    return this._mediaFileNameList.audioTempFile;
  }

  get recordFileName(): string {
    return this._mediaFileNameList.recordFile;
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

  setFileName = (roomId: string): MediaFileNameList => {
    return {
      audioTempFile: `audio-${roomId}.sock`,
      recordFile: `lecture-${roomId}.mp3`
    };
  };

  stopRecording = () => {
    this._audioSink.stop();
    this._audio.end();
  };
}
