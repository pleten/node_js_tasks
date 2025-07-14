import express from 'express';
import { container } from '../container';
import { Type } from '../types';
import { GuardsMiddleware } from './guards.middleware';
import { HandlerMiddleware } from './handler.middleware';
import { FiltersMiddleware } from './filters.middleware';
import { asyncHandler } from './async.handler';

export function Factory(modules: any[]) {
  const app = express();

  app.use(express.json());

  const router = express.Router();
  const globalGuards: Array<Type> = [];
  const globalPipes: Array<Type> = [];
  const globalFilters: Array<Type> = [];

  const buildModuleDeps = (module: any) => {
    const meta = Reflect.getMetadata('mynest:module', module);
    if (!meta) return false;

    for (const Ctl of meta.controllers ?? []) {
      container.register(Ctl, Ctl);
      const prefix = Reflect.getMetadata('mynest:prefix', Ctl) ?? '';
      const routes = Reflect.getMetadata('mynest:routes', Ctl) ?? [];

      const instance = container.resolve(Ctl) as InstanceType<typeof Ctl>;

      routes.forEach((r: any) => {
        const handler = instance[r.handlerName] as (
          ...args: any[]
        ) => Promise<any>;

        const path = prefix + r.path;

        (router as any)[r.method](
          path,
          asyncHandler(GuardsMiddleware(Ctl, handler, globalGuards)),
          asyncHandler(HandlerMiddleware(instance, handler, globalPipes)),
        );
        app.use(FiltersMiddleware(Ctl, handler, globalFilters));
      });
    }

    for (const ImportMod of meta.imports ?? []) {
      buildModuleDeps(ImportMod);
    }
  };

  const listen = (port: number, callback?: () => void) => {
    for (const mod of modules) {
      buildModuleDeps(mod);
    }

    app.listen(port, callback);
  };

  app.use(router);

  return {
    get: container.resolve,
    listen,
    use: (path: string, handler: express.RequestHandler) => {
      app.use(path, handler);
    },
    useGlobalGuards: (guards: any[]) => {
      globalGuards.push(...guards);
    },
    useGlobalPipes: (pipes: any[]) => {
      globalPipes.push(...pipes);
    },
    useGlobalFilters: (filters: any[]) => {
      globalFilters.push(...filters);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useGlobalInterceptors: (interceptors: any[]) => {
      throw new Error('Interceptors are not implemented yet');
    },
  };
}
