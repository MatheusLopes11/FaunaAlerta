import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { DIR_UPLOADS } from './common/uploads.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Fotos e vídeos enviados. Os nomes são aleatórios e só tipos conhecidos são gravados.
  app.useStaticAssets(DIR_UPLOADS, {
    prefix: '/uploads/',
    index: false,
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Servidor rodando com sucesso em: http://localhost:${port}`);
}
await bootstrap();