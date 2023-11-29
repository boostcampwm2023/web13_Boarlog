import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnterCode } from 'src/room/room-code.schema';
import { GenerateUtils } from 'src/utils/GenerateUtils';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { Lecture } from './lecture.schema';

@Injectable()
export class LectureService {
  constructor(
    @InjectModel(Lecture.name)
    private lectureModel: Model<Lecture>,
    @InjectModel(EnterCode.name)
    private enterCodeModel: Model<EnterCode>
  ) {}

  async createLecture(createLectureDto: CreateLectureDto) {
    const lecture = await new this.lectureModel(createLectureDto).save();
    const lectureCode = await new this.enterCodeModel({
      code: await this.generateRoomCode(),
      lecture_id: lecture.id
    }).save();

    return lectureCode.code;
  }

  async saveAudioData(updateLectureDto: UpdateLectureDto) {
    return await this.lectureModel
      .findByIdAndUpdate(updateLectureDto.id, { $set: { audio_file: updateLectureDto.audio } })
      .exec();
  }

  async generateRoomCode() {
    const generateUtils = new GenerateUtils();
    let lectureCode = generateUtils.generateRandomNumber();
    while (await this.findLectureByCode(lectureCode)) {
      lectureCode = generateUtils.generateRandomNumber();
    }
    return lectureCode;
  }

  async findLectureByCode(code: string) {
    return await this.enterCodeModel.findOne({ code: code });
  }
}
