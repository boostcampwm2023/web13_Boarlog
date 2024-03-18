import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';


describe('UserModule', () => {
  let service: UserService;
  let model: Model<User>;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService,
        {
          provide: getModelToken(User.name),
          useValue: Model
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should have UserService', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    const id = new Types.ObjectId();
    const email = "test@gmail.com";

    it('should throw NotFoundException', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      await expect(service.findOneByEmail(email)).rejects.toThrow(NotFoundException);
    })

    it('should find user', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue({
        _id: id,
        email: email
      });
      const user = await service.findOneByEmail(email);
      expect(user._id).toEqual(id);
      expect(user.email).toEqual(email);
    })
  });
  
  describe('updateUsername', () => {
    const id = new Types.ObjectId();
    const email = "test@gmail.com";
    const username = "testname";

    it('should throw NotFoundException', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(null);
      await expect(service.updateUsername(email, username)).rejects.toThrow(NotFoundException);
    })

    it('should update username', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue({
        _id: id,
        email: email,
        username: username
      });
      
      const user = await service.updateUsername(email, username);
      expect(user.username).toEqual(username);
    })
  });

  
  describe('findLectureList', () => {
    const email = "test@gmail.com";

    it('should throw NotFoundException', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      await expect(service.findLectureList(email)).rejects.toThrow(NotFoundException);
    })
  });

  describe('updateLectureList', () => {
    const email = 'test@gmail.com';
    const id = new Types.ObjectId();

    it('should throw NotFoundException', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(null);
      await expect(service.updateLectureList(email, id)).rejects.toThrow(NotFoundException);
    })

    it('should call with', async () => {
      const findOneAndUpdateMock = jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue({});
      
      await service.updateLectureList(email, id);
      expect(findOneAndUpdateMock).toHaveBeenCalledWith(
        { email: email },
        { $push: { lecture_id: id } },
        { new: true }
      );
    })
  });
});