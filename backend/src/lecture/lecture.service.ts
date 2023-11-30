import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenerateUtils } from 'src/utils/GenerateUtils';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { EnterCode } from './lecture-code.schema';
import { Lecture } from './lecture.schema';

@Injectable()
export class LectureService {
  constructor(
    @InjectModel(Lecture.name)
    private lectureModel: Model<Lecture>,
    @InjectModel(EnterCode.name)
    private enterCodeModel: Model<EnterCode>
  ) {}

  async createLecture(createLectureDto: CreateLectureDto, userId: string) {
    const lecture = new this.lectureModel({
      title: createLectureDto.title,
      description: createLectureDto.description,
      presenter_id: userId
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
    return;
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
