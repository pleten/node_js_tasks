import { NextFunction, Request, Response } from 'express';
import { runGuards } from '../decorators';
import { Type } from '../types';
import { HttpException } from '../errors';

export const GuardsMiddleware =
  (Ctl: Function, handler: Function, globalGuards: Array<Type> = []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const guardResult = await runGuards(Ctl, handler, req, res, globalGuards);
    if (typeof guardResult !== 'string') {
      return next();
    }
    throw new HttpException(403, { message: `Forbidden by ${guardResult}` });
  };
