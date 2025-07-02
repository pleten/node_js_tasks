const { json, bodyJSON } = require('../lib/json.js');
const Service = require('../services/service.js');

class Controller {
    constructor() {
        this.service = new Service();
    }

    async handler(req, res) {
        try {
            const path = req.url.split( '?' )[0];

            if (req.method === 'GET' && path.match(/^\/kv\/[a-zA-Z0-9]*$/)) {
                const key = path.match(/^\/kv\/([a-zA-Z0-9]*)$/)[1];
                const response = await this.service.get(key);

                return response.value ? json(res, 200, response) : json(res, 404, {error: 'No such key'});
            }
            if (req.method === 'POST' && path === '/kv') {
                const body = await bodyJSON(req);
                return json(res, 201, await this.service.post(body));
            }
            json(res, 405, { error: 'Method not allowed' });
        } catch (e) {
            json(res, 500, { error: e.message });
        }
    }
}

module.exports = Controller;