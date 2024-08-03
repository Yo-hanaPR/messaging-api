import { Controller, Post, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const token = await this.authService.login(loginDto.username, loginDto.password);
      return res.json({ token });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
  }

  @Post('register')
  async register(@Body() { username, password }): Promise<any> {
    const user = await this.authService.register(username, password);
    return { message: 'User registered successfully', user };
  }

  @Get('register')
  getRegisterPage(@Res() res: Response) {
    res.sendFile('register.html', { root: 'public' });
  }

}
