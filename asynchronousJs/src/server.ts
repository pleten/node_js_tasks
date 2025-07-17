/* eslint-disable no-console */
import * as http from 'node:http';
import { createApp } from './app.js';

const app    = createApp();
const server = http.createServer(app);
const port = process.env.ZIP_API_PORT || 3000

server.listen(port, () =>
    console.log(`Zip API ready on http://localhost:${port}`)
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
