const { join }  =  require( 'node:path');
const {json} = require('./json');
const fs = require('fs');

class Router {

    #pathToRoute(path) {
        return join(__dirname, '../routes', path, 'route.js');
    };
    handler(req, resp) {
        const path = req.url.includes('?') ? req.url.split('?')[0] : req.url;
        const params = {};
        let route = null;

        try {
            route = require(this.#pathToRoute(path));
        }
        catch  {
            const segments = path.split('/').filter(segment => segment !== '');
            for(let i = 0; i < segments.length; i += 1) {
                const currentPath = segments.slice(0, i+1).join('/');
                if(!fs.existsSync(join(__dirname, '../routes', currentPath))) {
                    const files = fs.readdirSync(join(__dirname, '../routes', segments.slice(0, i).join('/')));
                    const dynamicSegment = files.find(file => file.match(/\[[a-zA-Z]*]/g));
                    if(!dynamicSegment) {
                        json(resp, 404,{ error: 'Not Found' });
                        return;
                    }
                    params[dynamicSegment.replaceAll(/[[\]]/g, '')] = segments[i];
                    segments[i] = dynamicSegment;
                }

            }
            try {
                const newPath = this.#pathToRoute(segments.join('/'));
                route = require(newPath);
            }
            catch {
                return json(resp, 404,{ error: 'Not Found' });
            }
        }

        if(route?.handler) {
            route.handler(req, resp, params);
        } else {
            return json(resp, 404,{ error: 'Not Found' });
        }
    }
}

module.exports = Router;