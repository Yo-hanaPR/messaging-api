import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto'; // Asegúrate de importar LoginDto desde el lugar correcto
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import * as request from 'supertest';
import { User } from './user.schema'; // Ajusta la ruta según tu estructura

import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let app: INestApplication;
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
        JwtService,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'password' }; // Ajusta según tu DTO
      const token = 'jwt-token';
      jest.spyOn(service, 'login').mockResolvedValue(token);

      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await controller.login(loginDto, res);

      expect(service.login).toHaveBeenCalledWith(loginDto.username, loginDto.password);
      expect(res.json).toHaveBeenCalledWith({ token });
    });

    it('should return 401 when credentials are invalid', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'password' }; // Ajusta según tu DTO
      jest.spyOn(service, 'login').mockRejectedValue(new Error('Invalid credentials'));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.login(loginDto, res);

      expect(service.login).toHaveBeenCalledWith(loginDto.username, loginDto.password);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('register', () => {
    it('should return a success message and user on successful registration', async () => {
      const username = 'newuser';
      const password = 'newpassword';

      const hashedPassword = await bcrypt.hash(password, 10); 
      const user: User = { 
        username, 
        password: hashedPassword, 
        _id: new ObjectId().toString(), 
      } as any; 

      
      jest.spyOn(service, 'register').mockResolvedValue(user);

      const result = await controller.register({ username, password });

      expect(service.register).toHaveBeenCalledWith(username, password);
      expect(result).toEqual({
        message: 'User registered successfully',
        user,
      });
    });
  });

// It tests if the register page loads
describe('getRegisterPage', () => {
  it('should serve the register.html file', async () => {
    await request(app.getHttpServer())
      .get('/auth/register')
      .expect(HttpStatus.OK)
      .expect('Content-Type', /html/)
      .expect((res) => {
        expect(res.text).toContain('<!DOCTYPE html>');
      });
  });
});
});
