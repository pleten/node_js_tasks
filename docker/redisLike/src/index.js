const http = require('node:http');
const Controller = require('./controllers/controller')

const port = process.env.PORT ?? 4000;

http.createServer((req, res) => {
    const controller = new Controller();
    return controller.handler(req, res);
}).listen(port, () => console.log(`Server started on port :${port}`));