import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { EnterLectureDto } from './dto/enter-lecture.dto';
import { LectureInfoDto } from './dto/response-lecture-info.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { LectureService } from './lecture.service';
import { WhiteboardEventDto } from './dto/whiteboard-event.dto';

@ApiTags('lecture')
@Controller('lecture')
export class LectureController {
  constructor(
    private readonly lectureService: LectureService,
    private readonly userService: UserService
  ) {}

  @Post()
  @ApiBody({ type: CreateLectureDto })
  @ApiResponse({ status: 201 })
  async create(@Body() createLecture: CreateLectureDto, @Res() res: Response) {
    const user = await this.userService.findOneByEmail(createLecture.email);
    const code = await this.lectureService.createLecture(createLecture, user.id);
    res.status(HttpStatus.CREATED).send({ code: code });
  }

  @Patch('end')
  @ApiBody({ type: UpdateLectureDto })
  @ApiResponse({ status: 200 })
  async end(@Body() updateLectureDto: UpdateLectureDto, @Res() res: Response) {
    await this.lectureService.endLecture(updateLectureDto);
    res.status(HttpStatus.OK).send();
  }

  @Patch('/:code')
  @ApiParam({ name: 'code', type: 'string' })
  @ApiBody({ type: EnterLectureDto })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async enter(@Param('code') code: string, @Body() enterLectureDto: EnterLectureDto, @Res() res: Response) {
    const enterCodeDocument = await this.lectureService.findLectureByCode(code);
    if (!enterCodeDocument) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    await this.userService.updateLecture(enterLectureDto.email, enterCodeDocument.lecture_id);
    res.status(HttpStatus.OK).send();
  }

  @Get()
  @ApiQuery({ name: 'code', type: 'string' })
  @ApiResponse({ status: 200, type: LectureInfoDto })
  @ApiResponse({ status: 404, description: '해당 강의가 없습니다.' })
  async getLectureInfo(@Query('code') code: string, @Res() res: Response) {
    const enterCodeDocument = await this.lectureService.findLectureByCode(code);
    if (!enterCodeDocument) {
      throw new HttpException('해당 강의가 없습니다.', HttpStatus.NOT_FOUND);
    }
    const result = await this.lectureService.findLectureInfo(enterCodeDocument);
    res.status(HttpStatus.OK).send(result);
  }

  @Post('/log/:code')
  @ApiQuery({ name: 'code', type: 'string' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 404, description: '해당 강의가 없습니다.' })
  async addWhiteBoardLog(
    @Param('code') code: string,
    @Body() whiteboardEventDto: WhiteboardEventDto,
    @Res() res: Response
  ) {
    const enterCodeDocument = await this.lectureService.findLectureByCode(code);
    if (!enterCodeDocument) {
      throw new HttpException('해당 강의가 없습니다.', HttpStatus.NOT_FOUND);
    }
    await this.lectureService.saveWhiteBoardLog(enterCodeDocument.lecture_id, whiteboardEventDto);
    res.status(HttpStatus.CREATED).send();
  }

  @Post('/:code/text')
  @ApiParam({ name: 'code', type: 'string' })
  async saveLectureSubtitle(@Param('code') code: string, @Body() body: any, @Res() res: Response) {
    const lecture = await this.lectureService.findLectureByCode(code);
    if (!lecture) {
      throw new HttpException('해당 강의가 없습니다.', HttpStatus.NOT_FOUND);
    }
    this.lectureService.saveLectureSubtitle(lecture, body.segments);
    res.status(HttpStatus.OK).send();
  }
}
