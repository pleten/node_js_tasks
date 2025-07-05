import { createContainer, asClass } from 'awilix';
import BrewModel from './models/brew.model.js';
import BrewService from './services/brew.service.js';
import BrewController from './controllers/brew.controller.js';
import {objectMap} from './utils/Object.map.js';

const brewModule = {
  // DATA
  brewModel: BrewModel,
  // BUSINESS
  brewService: BrewService,
  // HTTP
  brewController: BrewController
};

/**
 * injectionMode: ‘CLASSIC’ означає:
 * Awilix дивиться імена параметрів конструктора і підставляє
 * відповідні реєстраційні токени.
 */

export const container = createContainer({ injectionMode: 'CLASSIC' })
  .register(
    objectMap(brewModule, value => asClass(value)[value.scope]())
  );
