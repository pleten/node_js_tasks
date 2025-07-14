import 'reflect-metadata';
import { Factory } from './core';
import { AppModule } from './apps/app.module';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // process.exit(1);
});

const app = Factory([AppModule]);

const port = 8081;

app.listen(port, () =>
  console.log(`Nest-like server is listening on http://localhost:${port}`),
);
