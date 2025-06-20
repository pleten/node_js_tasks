/* eslint-disable no-console */
import Service from '../services/service.js';

class Controller {
    constructor() {
    }

    async handle(args) {
        const service = new Service();
        let response;
        const {command, params, error} = args;
        if(error) {
            console.error(error);
            return;
        }
        if(!command) {
            console.error('Oops! Something went wrong.');
            return;
        }
        switch (command) {
            case 'add':
                response = await service.add(params);
                break;
            case 'list':
                response = await service.list();
                break;
            case 'done':
                response = await service.done(params);
                break;
            case 'history':
                response = await service.history();
                break;
            case 'stats':
                response = await service.stats(params);
                break;
            case 'delete':
                response = await service.delete(params);
                break;
            case 'update':
                response = await service.update(params);
                break;
            default:
                console.error('Command is invalid. Please provide one of following commands:  add, list, done, stats, delete, update');
                return;
        }
        if(response.message) {
            console.log(response.message);
        } else if(response.error) {
            console.error(response.error);
        } else {
            console.error('Oops! Something went wrong.');
        }
    }

}


export default Controller;
/* eslint-enable no-console */
