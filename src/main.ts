import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Note: this function does not get called when running e2e tests
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // A pipe is called Middleware
  await app.listen(3001);
}
bootstrap();
