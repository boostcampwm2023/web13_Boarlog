import { Body, Controller, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { LectureService } from './lecture.service';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  async create(@Body() createLecture: CreateLectureDto, @Res() res: Response) {
    const code = await this.lectureService.createLecture(createLecture);
    res.status(HttpStatus.CREATED).send({ code: code });
  }

  @Patch('audio')
  async saveAudioFile(@Body() updateLectureDto: UpdateLectureDto, @Res() res: Response) {
    const result = await this.lectureService.saveAudioData(updateLectureDto);
    res.status(HttpStatus.OK).send(result);
  }
}
