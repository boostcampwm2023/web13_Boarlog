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
    const email = "test@gmail.com";

    it('should throw NotFoundException', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      await expect(service.findOneByEmail(email)).rejects.toThrow(NotFoundException);
    })

    it('should find user', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue({
        email: email
      });
      const user = await service.findOneByEmail(email);
      await expect(service.findOneByEmail(email)).resolves.toEqual({email: email});
    })
  });
  
  describe('updateUsername', () => {
    const email = "test@gmail.com";
    const username = "testname";

    it('should throw NotFoundException', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(null);
      await expect(service.updateUsername(email, username)).rejects.toThrow(NotFoundException);
    })
  });

  describe('findLectureList', () => {

  });

  describe('updateLectureList', () => {
    const email = 'test@gmail.com';
    const id = new Types.ObjectId();

    it('should throw NotFoundException', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(null);
      await expect(service.updateLectureList(email, id)).rejects.toThrow(NotFoundException);
    })
  });
});