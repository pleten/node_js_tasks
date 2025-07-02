const { json, bodyJSON } = require('../lib/json.js')
const Service = require('../services/service.js');

class Controller {
    constructor() {
        this.service = new Service();
    }

    async handler(req, res) {
        try {
            const path = req.url.split( '?' )[0];
            const queryParams = new URLSearchParams(req.url.split( '?' )[1]);

            if (req.method === 'GET' && path === '/get') {
                if(queryParams && queryParams.get('key')) {
                    return json(res, 200, await this.service.get(queryParams.get('key')));
                } else {
                    return json(res, 400, { error: 'Please provide valid "key" in query params' });
                }
            }
            if (req.method === 'POST' && path === '/set') {
                const body = await bodyJSON(req);
                return json(res, 201, await this.service.set(body));
            }
            json(res, 405, { error: 'Method not allowed' });
        } catch (e) {
            json(res, 500, { error: e.message });
        }
    }
}

module.exports = Controller;