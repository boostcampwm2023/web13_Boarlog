import { ApiProperty } from '@nestjs/swagger';

export class WhiteboardEventDto {
  @ApiProperty({
    example: '"canvasJSON": "{\\"version\\":\\"5.3.0\\",\\"objects\\":[{\\"type\\":\\"path\\", ...'
  })
  canvasJSON: string;

  @ApiProperty({
    example: '[0.9999999999999875, 0, 0, 0.9999999999999875, 171.2148298216324, 100.8520614096598]'
  })
  viewPort: number[];

  @ApiProperty({ example: '2023-12-06T12:34:56.789Z' })
  eventDate: Date;
}
