import { parseArgs } from './src/helpers/parseArgs.js';
import Controller from './src/controllers/controller.js';

const controller = new Controller();
const data = parseArgs(process.argv);

(async () => await controller.handle(data))();
