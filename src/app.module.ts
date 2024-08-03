import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/message.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { DashboardController } from './dashboard/dashboard.controller';

import { UsersModule } from './users/users.module';  

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/messaging-api'),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    }),
    AuthModule,
    MessagesModule,
    UsersModule,
  ],
  controllers: [DashboardController],
})
export class AppModule {}
