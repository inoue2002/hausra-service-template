import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 8080);
  await app.listen(port, '0.0.0.0');
  console.log(`アプリケーションが起動しました: ${await app.getUrl()}`);
}
bootstrap();
