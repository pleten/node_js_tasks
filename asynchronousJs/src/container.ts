import { createContainer, asClass } from 'awilix';
import ZipModel from './models/zip.model.js';
import ZipService from './services/zip.service.js';
import ZipController from './controllers/zip.controller.js';
import {objectMap} from './utils/Object.map.js';

const zipModule = {
  zipModel: ZipModel,
  zipService: ZipService,
  zipController: ZipController
};

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
  scope: 'singleton' | 'scoped';
}

export const container = createContainer({ injectionMode: 'CLASSIC' })
  .register(
    objectMap(zipModule, (value: Type) => asClass(value)[value.scope]())
  );
