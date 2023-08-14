import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// For some TS settings cannot use normal import for cookie-session
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // A pipe is called Middleware
  app.use(cookieSession( {
    // dfgEWEF4345$#%dsfF is a random string used to encrypt cookies
    // Do not do this on a production environment, will be changed later
    keys: ['dfgEWEF4345$#%dsfF']
  })) 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3001);
}
bootstrap();
