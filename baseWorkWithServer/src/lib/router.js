const { join }  =  require( 'node:path');
const {json} = require('./json');
const fs = require('fs');

class Router {

    handler(req, resp) {
        const path = req.url.includes('?') ? req.url.split('?')[0] : req.url;
        const params = path.match(/\d+/g) || [];
        let routerPath;
        if(params.length > 0) {
            const pathWithDynamicSegments = path.replaceAll(/\d+/g, '_dynamic_');
            const staticSegments = pathWithDynamicSegments.split('_dynamic_');
            let calculatedPath = '';
            for(let i = 0; i< staticSegments.length; i+=1) {
                calculatedPath += staticSegments[i];
                const files = fs.readdirSync(join(__dirname, '../routes', calculatedPath));
                calculatedPath += files.filter(file => file.match(/\[[a-zA=Z]*]/g))[0] || '';
            }

            routerPath= join(__dirname, '../routes', calculatedPath, 'route.js');

        } else {
            routerPath = join(__dirname, '../routes', path, 'route.js');
        }

        const route = require(routerPath);

        if (route?.handler) {
            route.handler(req, resp, params);
        } else {
            json(resp, 404,{ error: 'Not Found' });
        }
    }
}

module.exports = Router;