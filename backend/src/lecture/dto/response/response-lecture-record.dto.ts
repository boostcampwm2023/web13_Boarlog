import { ApiProperty } from '@nestjs/swagger';
import { WhiteboardEventDto } from '../whiteboard-event.dto';
import { Subtitle } from '../../interfaces/Subtitle';

export class LectureRecordDto {
  @ApiProperty()
  logs: WhiteboardEventDto[];

  @ApiProperty()
  subtitles: [Subtitle];

  @ApiProperty()
  audio_file: string;

  constructor(logs: WhiteboardEventDto[], subtitles: [Subtitle], audio_file: string) {
    this.logs = logs;
    this.subtitles = subtitles;
    this.audio_file = audio_file;
  }
}
