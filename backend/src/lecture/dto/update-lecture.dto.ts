import { ApiProperty } from '@nestjs/swagger';

export class UpdateLectureDto {
  @ApiProperty({ example: '123456' })
  code: string;

  @ApiProperty({ example: 'AUDIO_URL' })
  audio: string;
}
