import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { WhiteboardLog } from './schema/whiteboard-log.schema';
import { WhiteboardEventDto } from './dto/whiteboard-event.dto';
import { LectureSubtitle } from './lecture-subtitle.schema';
import { Lecture } from './schema/lecture.schema';
import { EnterCode } from './schema/lecture-code.schema';
import { generateRandomNumber } from 'src/utils/GenerateUtils';
import { LectureRecordDto } from './dto/response/response-lecture-record.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectModel(Lecture.name)
    private lectureModel: Model<Lecture>,
    @InjectModel(EnterCode.name)
    private enterCodeModel: Model<EnterCode>,
    @InjectModel(WhiteboardLog.name)
    private whiteboardLogModel: Model<WhiteboardLog>,
    @InjectModel(LectureSubtitle.name)
    private lectureSubtitleModel: Model<LectureSubtitle>
  ) {}

  async createLecture(createLectureDto: CreateLectureDto, id: Types.ObjectId) {
    const lecture = new this.lectureModel({
      title: createLectureDto.title,
      description: createLectureDto.description,
      presenter_id: id
    });
    const lectureCode = new this.enterCodeModel({
      code: await this.generateRoomCode(),
      lecture_id: lecture.id
    });

    await Promise.all([lecture.save(), lectureCode.save()]);

    return lectureCode.code;
  }

  async endLecture(updateLectureDto: UpdateLectureDto) {
    const lecture = await this.findLectureByCode(updateLectureDto.code);
    await Promise.all([
      this.enterCodeModel.deleteOne({ lecture_id: lecture.lecture_id }),
      this.lectureModel
        .findByIdAndUpdate(lecture.lecture_id, { $set: { is_end: true, audio_file: updateLectureDto.audio } })
        .exec()
    ]);
  }

  async generateRoomCode() {
    let lectureCode = generateRandomNumber();
    while (await this.findLectureByCode(lectureCode)) {
      lectureCode = generateRandomNumber();
    }
    return lectureCode;
  }

  async findLectureByCode(code: string) {
    return await this.enterCodeModel.findOne({ code: code }).exec();
  }

  async findLectureInfo(enterCode: EnterCode) {
    return await this.lectureModel.findById(enterCode.lecture_id).populate('presenter_id').exec();
  }

  async saveWhiteBoardLog(lecture: Lecture, whiteboardEventDto: WhiteboardEventDto) {
    const whiteboardLog = new this.whiteboardLogModel({
      canvasJSON: whiteboardEventDto.canvasJSON,
      viewport: whiteboardEventDto.viewport,
      eventTime: whiteboardEventDto.eventTime,
      width: whiteboardEventDto.width,
      height: whiteboardEventDto.height,
      lecture_id: lecture
    });
    return await whiteboardLog.save();
  }

  extractAPIData(data: any) {
    return data.map((segment: any) => {
      return { start: String(segment.start), text: segment.textEdited };
    });
  }

  async saveLectureSubtitle(lecture: EnterCode, data: any) {
    const subtitleInfo = this.extractAPIData(data);
    return await new this.lectureSubtitleModel({
      lecture_id: lecture.lecture_id,
      subtitle: subtitleInfo
    }).save();
  }

  async findLogs(lecture: Lecture) {
    return await this.whiteboardLogModel.find({ lecture_id: lecture }, { _id: 0, lecture_id: 0, __v: 0 }).exec();
  }

  async findLectureRecord(id: Types.ObjectId) {
    const lecture = await this.lectureModel.findById(id).exec();
    const logs = await this.findLogs(lecture);
    const subtitles = (await this.lectureSubtitleModel.findOne({ lecture_id: lecture }).exec()).subtitle;
    const audioFile = lecture.audio_file;
    return new LectureRecordDto(logs, subtitles, audioFile);
  }
}
