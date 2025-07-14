import { Request, Response } from 'express';
import { ArgumentMetadata, Type } from '../types';
import { extractParams } from '../utils';
import { runPipes } from '../decorators';

const getHandlerArgs = async (
  Ctl: Function,
  handler: Function,
  req: Request,
  globalPipes: Array<Type>,
) => {
  const paramMeta: Array<ArgumentMetadata> =
    Reflect.getMetadata('mynest:params', Ctl) ?? [];
  const methodMeta: Array<ArgumentMetadata> = paramMeta.filter(
    (m) => m.name === handler.name,
  );
  const sortedMeta = [...methodMeta].sort((a, b) => a.index - b.index);
  const args: any[] = [];
  for (const metadata of sortedMeta) {
    const extracted = extractParams(req, metadata.type);
    const argument = metadata.data ? extracted[metadata.data] : extracted;

    args[metadata.index] = await runPipes(
      Ctl,
      handler,
      argument,
      metadata,
      globalPipes,
    );
  }

  return args;
};

export const HandlerMiddleware = (
  instance: Type,
  handler: Function,
  globalPipes: Array<Type>,
) => {
  return async (req: Request, res: Response) => {
    const args = await getHandlerArgs(
      instance.constructor,
      handler,
      req,
      globalPipes,
    );

    const result = await handler.apply(instance, args);
    res.json(result);
  };
};
