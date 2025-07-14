import { Request, Response } from 'express';
import { ExpressExecutionContext } from '../utils';
import { Type } from '../types';
import { container } from '../container';

export const GUARDS_METADATA = Symbol('guards');

export function UseGuards(
  ...guards: Function[]
): ClassDecorator & MethodDecorator {
  return (target: any, key?: string | symbol) => {
    if (key) {
      Reflect.defineMetadata(GUARDS_METADATA, guards, target[key]);
    } else {
      Reflect.defineMetadata(GUARDS_METADATA, guards, target);
    }
  };
}

const getGuards = (
  handler: Function,
  controllerClass: Function,
  globalGuards: Array<Type> = [],
) => {
  const controllerGuards =
    Reflect.getMetadata(GUARDS_METADATA, controllerClass) ?? [];
  const routeGuards = Reflect.getMetadata(GUARDS_METADATA, handler) ?? [];

  return [...globalGuards, ...controllerGuards, ...routeGuards];
};

export async function runGuards(
  controllerClass: Function,
  handler: Function,
  req: Request,
  res: Response,
  globalGuards: Array<Type> = [],
): Promise<boolean | string> {
  const guards = getGuards(handler, controllerClass, globalGuards);

  console.log({ guards });

  for (const GuardCtor of guards) {
    const guardInstance = container.resolve<any>(GuardCtor);

    const ctx = new ExpressExecutionContext(controllerClass, handler, req, res);

    const can = await Promise.resolve(guardInstance.canActivate(ctx));
    console.log({ can, GuardCtor });
    if (!can) return GuardCtor.name;
  }
  return true;
}
