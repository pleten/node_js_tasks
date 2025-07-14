import { Type } from '../types';
import { NextFunction, Request, Response } from 'express';
import { runFilters } from '../decorators';

export const FiltersMiddleware =
  (Ctl: Function, handler: Function, filters: Array<Type>) =>
  async (err: any, req: Request, res: Response, next: NextFunction) => {
    const runFiltersRes = await runFilters(
      Ctl,
      handler,
      err,
      res,
      next,
      filters,
    );
    err.stack = undefined;
    if (err.message) {
      return runFiltersRes;
    }
  };
