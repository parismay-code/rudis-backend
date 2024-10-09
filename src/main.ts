import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  const devOrigin = ['http://localhost:3000'];

  let origin = [`http://${process.env.SERVER_NAME}`];

  if (process.env.NODE_ENV !== 'production') {
    origin = [...origin, ...devOrigin];
  }

  app.enableCors({
    credentials: true,
    origin,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(redisIoAdapter);
  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('RuDis API')
      .setDescription('RuDis API documentation')
      .setVersion('1.0.0')
      .addTag('rudis')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api', app, document);
  }

  await app.listen(process.env.BACKEND_PORT || 3000, () => {
    console.log(
      `Server is running on port ${process.env.BACKEND_PORT || 3000}`,
    );
  });
}

bootstrap().catch((error) => {
  console.error('An error occurred:', error);
});
