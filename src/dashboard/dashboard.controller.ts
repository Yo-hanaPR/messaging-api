import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { join } from 'path';

@Controller('dashboard')
export class DashboardController {
  //@UseGuards(JwtAuthGuard)
  @Get()
  getDashboard(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', '..', 'public', 'dashboard.html'));
  }
}
