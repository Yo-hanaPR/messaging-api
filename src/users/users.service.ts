import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findUsersExcluding(username: string): Promise<User[]> {
    try {
      return this.userModel.find({ username: { $ne: username } }).exec();
    } catch (error) {
      throw new NotFoundException('Users not found');
    }
  }

}
