/* eslint-disable no-console */
import http from 'node:http';
import { createApp } from './app.js';
import { config } from './config/index.js';

const app    = createApp();
const server = http.createServer(app);

server.listen(config.port, () =>
  console.log(`🚀 ${config.env} API ready on http://localhost:${config.port}`)
);

function shutDown() {
  console.log('🔄  Shutting down gracefully...');
  server.close(() => {
    console.log('✅  Closed out remaining connections');
    process.exit(0);
  });
  // Якщо через 10 сек не закрився — kill
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', shutDown);
process.on('SIGINT',  shutDown);
/* eslint-enable no-console */
