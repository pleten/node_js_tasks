import http from 'http';
import router from './src/controllers/index.js';

const server = http.createServer((req, res) => {
    router.handle(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});