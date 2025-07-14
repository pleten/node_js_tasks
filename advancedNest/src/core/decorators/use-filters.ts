import { NextFunction, Response } from 'express';
import { Type } from '../types';
import { container } from '../container';
import { ExceptionFilter } from '../errors/exeption.filter';

export const FILTERS_METADATA = Symbol('filters');
export interface FilterCatch<T = any, R = any> {
  catch(error: T, res: Response, next?: NextFunction): R | Promise<R>;
}

export function UseFilters(
  ...filters: Function[]
): ClassDecorator & MethodDecorator {
  return (target: any, key?: string | symbol) => {
    if (key) {
      Reflect.defineMetadata(FILTERS_METADATA, filters, target[key]);
    } else {
      Reflect.defineMetadata(FILTERS_METADATA, filters, target);
    }
  };
}

const getFilters = (
  handler: Function,
  controllerClass: Function,
  globalFilters: Array<Type> = [],
) => {
  const controllerFilters =
    Reflect.getMetadata(FILTERS_METADATA, controllerClass) ?? [];
  const routeFilters = Reflect.getMetadata(FILTERS_METADATA, handler) ?? [];

  return [
    ...globalFilters,
    ...controllerFilters,
    ...routeFilters,
    ExceptionFilter,
  ];
};

export async function runFilters(
  controllerClass: Function,
  handler: Function,
  err: any,
  res: Response,
  next: NextFunction,
  globalFilters: Array<Type> = [],
): Promise<boolean | string> {
  const filters = getFilters(handler, controllerClass, globalFilters);

  for (const FilterCtor of filters) {
    // інстанціюємо через IoC (підтримка @Injectable() всередині Filter-а)
    const filterInstance = container.resolve<any>(FilterCtor);

    const can = await Promise.resolve(filterInstance.catch(err, res, next));
    console.log({ can, FilterCtor });
    if (!can) return FilterCtor.name;
  }
  return true;
}
