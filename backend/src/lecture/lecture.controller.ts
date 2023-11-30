import { Body, Controller, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { EnterLectureDto } from './dto/enter-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { LectureService } from './lecture.service';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly lectureService: LectureService,
    private readonly userService: UserService
  ) {}

  @Post()
  async create(@Body() createLecture: CreateLectureDto, @Res() res: Response) {
    const user = await this.userService.findOneByEmail(createLecture.email);
    const code = await this.lectureService.createLecture(createLecture, user.id);
    res.status(HttpStatus.CREATED).send({ code: code });
  }

  @Patch('end')
  async end(@Body() updateLectureDto: UpdateLectureDto, @Res() res: Response) {
    await this.lectureService.endLecture(updateLectureDto);
    res.status(HttpStatus.OK).send();
  }

  @Patch('/:code')
  async enter(@Param('code') code: string, @Body() enterLectureDto: EnterLectureDto, @Res() res: Response) {
    const enterCodeDocument = await this.lectureService.findLectureByCode(code);
    if (!enterCodeDocument) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    const result = await this.userService.updateLecture(enterLectureDto.email, enterCodeDocument.lecture_id);
    res.status(HttpStatus.OK).send(result);
  }
}
