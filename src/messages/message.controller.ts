import { Controller, Post, Res, Body, UseGuards, Get, Query, Param, Put, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Response, Request } from 'express';
import { join } from 'path';
import { JwtService } from '@nestjs/jwt'; 

@Controller('messages')
export class MessageController {
  constructor(
    private messageService: MessageService,
    private jwtService: JwtService 
  ) {}

  //returns all the messages

  //@UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllMessages(@Query('username') username: string, @Query('filter') filter: string) {
    const messages = await this.messageService.getMessages(username, filter);
    return { messages };
  }

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendMessage(@Body() createMessageDto: CreateMessageDto): Promise<any> {
    const { sender, receiver, content } = createMessageDto;
    console.log("quien envía? " +sender)
    await this.messageService.sendMessage(sender, receiver, content);
    return { message: 'Message sent successfully' };
  }

  //@UseGuards(JwtAuthGuard) to fetch all the messages
  @Get()
  async getMessages(@Query('username') username: string, @Query('filter') filter: string): Promise<any> {
    const messages = await this.messageService.getMessages(username, filter);
    return { messages };
  }

  @UseGuards(JwtAuthGuard)
  @Put('read/:id')
  async markAsRead(@Param('id') id: string): Promise<any> {
    const message = await this.messageService.markAsRead(id);
    return { message };
  }

  //@UseGuards(JwtAuthGuard)
  @Get('send-message')

  getSendMessage(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', '..', 'public', 'send-message.html'));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader) {
      return { message: 'Unauthorized' };
    }

    const token = authHeader.split(' ')[1];
    try {
      const user = await this.jwtService.verifyAsync(token);
      return user;
    } catch (error) {
      return { message: 'Unauthorized' };
    }
  }
}
