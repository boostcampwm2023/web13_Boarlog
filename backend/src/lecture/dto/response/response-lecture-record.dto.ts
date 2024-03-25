import { ApiProperty } from '@nestjs/swagger';
import { WhiteboardEventDto } from '../whiteboard-event.dto';
import { Subtitle } from '../../interfaces/Subtitle';
import { WhiteboardLog } from 'src/lecture/schema/whiteboard-log.schema';

export class LectureRecordDto {
  @ApiProperty()
  logs: WhiteboardEventDto[];

  @ApiProperty()
  subtitles: [Subtitle];

  @ApiProperty()
  audio_file: string;

  constructor(logs: WhiteboardLog[], subtitles: [Subtitle], audio_file: string) {
    this.logs = logs.map((log) => new WhiteboardEventDto(log));
    this.subtitles = subtitles;
    this.audio_file = audio_file;
  }
}
