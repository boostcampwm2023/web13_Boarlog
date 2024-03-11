import wrtc, { RTCAudioSink } from 'wrtc';
import fs from 'fs';
const { RTCAudioSink } = wrtc.nonstandard;
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import { PeerStreamInfo } from '../models/PeerStreamInfo';
import { uploadFileToObjectStorage } from './ncp-storage';
import { RETRIABLE_ERROR, SUCCEEDED } from '../constants/clova-api-response-type.constant';
import { ClovaApiReponse } from '../dto/clova-api-response.dto';
import { ClovaApiRequest } from '../dto/clova-api-request.dto';
import { AUDIO_OUTPUT_DIR } from '../constants/media-converter.constant';
import { runFfmpegCommand } from './ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath.path);

class MediaConverter {
  private readonly _presenterStreamInfoList: Map<string, PeerStreamInfo>;

  constructor() {
    this._presenterStreamInfoList = new Map();
    if (!fs.existsSync(AUDIO_OUTPUT_DIR)) {
      fs.mkdirSync(AUDIO_OUTPUT_DIR);
    }
  }

  getPresenterStreamInfo = (roomId: string) => {
    return this._presenterStreamInfoList.get(roomId);
  };

  startRecording = (roomId: string, tracks: MediaStream) => {
    tracks.getTracks().forEach((track) => this.setAudioSampleDataEventListener(roomId, track));
  };

  setAudioSampleDataEventListener = (roomId: string, track: MediaStreamTrack) => {
    if (track.kind !== 'audio') {
      return;
    }
    const audioSink = new RTCAudioSink(track);
    if (this._presenterStreamInfoList.has(roomId)) {
      const presenterStreamInfo = this._presenterStreamInfoList.get(roomId) as PeerStreamInfo;
      presenterStreamInfo.pauseRecording();
      presenterStreamInfo.replaceAudioSink(audioSink);
    } else {
      this._presenterStreamInfoList.set(roomId, new PeerStreamInfo(audioSink, roomId));
    }
    audioSink.ondata = ({ samples: { buffer } }) => {
      const stream = this._presenterStreamInfoList.get(roomId) as PeerStreamInfo;
      this.pushAudioSample(stream, buffer);
    };
  };

  pushAudioSample = (streamInfo: PeerStreamInfo, buffer: ArrayBufferLike) => {
    if (!streamInfo.recordEnd) {
      streamInfo.audio.push(Buffer.from(buffer));
    }
  };

  endRecording = async (roomId: string): Promise<void> => {
    const streamInfo = this._presenterStreamInfoList.get(roomId);
    if (!streamInfo) {
      console.log('해당 강의실 발표자가 존재하지 않습니다.');
      return;
    }
    this.pipeMediaStreamToFile(roomId);
    runFfmpegCommand(
      this.getAbsoluteOutputPath(streamInfo.audioTempFileName),
      this.getAbsoluteOutputPath(streamInfo.recordFileName),
      roomId,
      streamInfo,
      this.finalizeRecording
    );
  };

  pipeMediaStreamToFile = (roomId: string) => {
    const streamInfo = this._presenterStreamInfoList.get(roomId) as PeerStreamInfo;
    const outputFile = fs.createWriteStream(this.getAbsoluteOutputPath(streamInfo.audioTempFileName));
    streamInfo.audio.pipe(outputFile);
  };

  finalizeRecording = async (roomId: string) => {
    const streamInfo = this._presenterStreamInfoList.get(roomId);
    if (!streamInfo) {
      console.log('해당 강의실 발표자가 존재하지 않습니다.');
      return;
    }
    streamInfo.stopRecording();
    this.deleteTempFile(streamInfo.audioTempFileName);
    await this.requestToServer(roomId);
    this._presenterStreamInfoList.delete(roomId);
  };

  getAbsoluteOutputPath = (fileName: string) => {
    return path.join(AUDIO_OUTPUT_DIR, fileName);
  };

  deleteTempFile = (tempFileName: string) => {
    fs.unlink(path.join(AUDIO_OUTPUT_DIR, tempFileName), (err) => {
      if (err) {
        console.log(`${tempFileName}을 찾을 수 없습니다.`);
      }
    });
  };

  saveAudioFile = async (roomId: string) => {
    const streamInfo = this._presenterStreamInfoList.get(roomId);
    if (!streamInfo) {
      console.log('해당 강의실 발표자가 존재하지 않습니다.');
      return;
    }
    const url = await uploadFileToObjectStorage(path.join(AUDIO_OUTPUT_DIR, streamInfo.recordFileName), roomId);
    console.log(`${url}에 파일 저장`);
    return url;
  };

  requestToServer = async (roomId: string) => {
    // TODO: API 서버에 강의 종료 요청하기
    const url = await this.saveAudioFile(roomId);
    await this.extractSubtitle(url, roomId);
    fetch((process.env.SERVER_API_URL + '/lecture/end') as string, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: roomId,
        audio: url
      })
    }).then((response) => console.log(`[${response.status}]강의 음성 파일 저장: ${url}`));
  };

  extractSubtitle = async (url: any, code: string) => {
    const response = await fetch(process.env.CLOVA_API_URL as string, ClovaApiRequest(url, code));
    const result = (await response.json()) as ClovaApiReponse;

    if (result.result == SUCCEEDED) {
      console.log(`[${result.result}] 강의 자막 저장`);
    }
    if (result.result in RETRIABLE_ERROR) {
      const response = await fetch(process.env.CLOVA_API_URL as string, ClovaApiRequest(url, code));
    }
  };
}

const mediaConverter = new MediaConverter();

export { mediaConverter };
