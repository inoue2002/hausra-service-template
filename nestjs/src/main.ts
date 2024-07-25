import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT) || 8080; // Cloud Run の要件。環境変数PORTで起動するように。
  await app.listen(port, '0.0.0.0'); // '0.0.0.0' を追加して外部からのアクセスを受け入れる。
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
