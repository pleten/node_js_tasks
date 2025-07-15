import { createContainer, asClass } from 'awilix';
import ZipModel from './models/zip.model';
import ZipService from './services/zip.service';
import ZipController from './controllers/zip.controller';
import {objectMap} from './utils/Object.map';

const zipModule = {
  zipModel: ZipModel,
  zipService: ZipService,
  zipController: ZipController
};

/**
 * injectionMode: ‘CLASSIC’ означає:
 * Awilix дивиться імена параметрів конструктора і підставляє
 * відповідні реєстраційні токени.
 */

export const container = createContainer({ injectionMode: 'CLASSIC' })
  .register(
    objectMap(zipModule, value => asClass(value)[value.scope]())
  );
