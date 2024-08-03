import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.schema';
@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  async sendMessage(sender: string, receiver: string, content: string): Promise<Message> {
    const message = new this.messageModel({ sender, receiver, content });
    return message.save();
  }

  async getMessages(username: string, filter: string): Promise<Message[]> {
    console.log("Username desde message.service "+username)
    let query = { receiver: username };

    if (filter === 'read') {
      query['isRead'] = true;
    } else if (filter === 'unread') {
      query['isRead'] = false;
    } else if (filter === 'starred') {
      query['isStarred'] = true;
    }
    
    return this.messageModel.find(query).exec();
  }

  async markAsRead(messageId: string): Promise<Message> {
    return this.messageModel.findByIdAndUpdate(messageId, { isRead: true }, { new: true });
  }
}
