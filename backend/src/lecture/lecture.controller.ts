import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { LectureInfoDto } from './dto/response/response-lecture-info.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { LectureService } from './lecture.service';
import { WhiteboardEventDto } from './dto/whiteboard-event.dto';
import { CustomAuthGuard } from 'src/auth/auth.guard';
import { PresenterInfo } from 'src/user/dto/presenterInfo.dto';
import { Types } from 'mongoose';

@ApiTags('lecture')
@Controller('lecture')
export class LectureController {
  constructor(
    private readonly lectureService: LectureService
  ) {}

  @UseGuards(CustomAuthGuard)
  @Post()
  @ApiHeader({ name: 'Authorization' })
  @ApiOperation({ description: '강의를 생성합니다.' })
  @ApiBody({ type: CreateLectureDto })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 401, description: '로그인 되지 않은 사용자입니다.' })
  async create(@Body() createLecture: CreateLectureDto, @Req() req: any, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('로그인 되지 않은 사용자입니다.', HttpStatus.UNAUTHORIZED);
    }
    const code = await this.lectureService.createLecture(createLecture, req.user.email);
    res.status(HttpStatus.CREATED).send({ code: code });
  }

  @Patch('end')
  @ApiBody({ type: UpdateLectureDto })
  @ApiResponse({ status: 200 })
  async end(@Body() updateLectureDto: UpdateLectureDto, @Res() res: Response) {
    await this.lectureService.endLecture(updateLectureDto);
    res.status(HttpStatus.OK).send();
  }

  @UseGuards(CustomAuthGuard)
  @Patch('/:code')
  @ApiHeader({ name: 'Authorization' })
  @ApiParam({ name: 'code', type: 'string' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: '로그인 되지 않은 사용자입니다.' })
  @ApiResponse({ status: 404, description: '유효하지 않은 강의 참여코드입니다.' })
  async enter(@Param('code') code: string, @Req() req: any, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('로그인 되지 않은 사용자입니다.', HttpStatus.UNAUTHORIZED);
    }

    const enterCodeDocument = await this.lectureService.findLectureByCode(code);
    if (!enterCodeDocument) {
      throw new HttpException('유효하지 않은 강의 참여코드입니다.', HttpStatus.NOT_FOUND);
    }

    await this.lectureService.updateLecture(req.user.email, enterCodeDocument);
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

    res.status(HttpStatus.OK).send(
      new LectureInfoDto({
        title: result.title,
        description: result.description,
        presenter: new PresenterInfo(result.presenter_id.username, result.presenter_id.email)
      })
    );
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

  @Get('/record/:id')
  async getLectureRecordInfo(@Param('id') id: Types.ObjectId, @Res() res: Response) {
    const result = await this.lectureService.findLectureRecord(id);
    return res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(CustomAuthGuard)
  @Get('/list')
  @ApiHeader({ name: 'Authorization' })
  async getLectureList(@Req() req: any, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('로그인 되지 않은 사용자입니다.', HttpStatus.UNAUTHORIZED);
    }

    const result = await this.lectureService.findLectureList(req.user.email);
    return res.status(HttpStatus.OK).send(result);
  }
}
