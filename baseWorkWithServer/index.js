const http = require('http');
const Router = require('./src/lib/router.js');

const router = new Router();
const server = http.createServer((req, res) => {
    router.handler(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});