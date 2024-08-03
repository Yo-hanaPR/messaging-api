import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async register(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashedPassword });
    return user.save();
  }

  async login(username: string, password: string): Promise<string> {

      const user = await this.userModel.findOne({ username });
      console.log(user) 
      
    if (user && await bcrypt.compare(password, user.password)) {
      return this.jwtService.sign({ username });
    }
    throw new Error('Invalid credentials');
  }
}