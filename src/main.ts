import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serveStatic from 'serve-static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(serveStatic(join(__dirname, '..', 'public')));
  await app.listen(3000);
}
bootstrap();
