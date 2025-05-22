
class Router {
    constructor() {
        this.routes = {}
    }

    addRoute(method, path, handler) {
        const key = `${method.toUpperCase()} ${path}`;
        this.routes[key] = handler;
    }

    handle(req, res) {
        const key = `${req.method} ${req.url.includes('?') ? req.url.split('?')[0] : req.url }`;
        const handler = this.routes[key];

        if (handler) {
            handler(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    }

}

export default Router;