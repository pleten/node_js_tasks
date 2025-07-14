import { ArgumentMetadata } from '../types';

export function Param(data?: string, pipe?: ParameterDecorator) {
  return function (target: any, name: string, idx: number) {
    if (pipe) {
      pipe(target, name, idx);
    }
    const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
    const metatype = ps[idx];
    const params: Array<ArgumentMetadata> =
      Reflect.getMetadata('mynest:params', target.constructor) ?? [];
    params.push({ index: idx, metatype, type: 'param', data, name });
    Reflect.defineMetadata('mynest:params', params, target.constructor);
  };
}

export function Body(pipe?: ParameterDecorator) {
  return function (target: any, name: string, idx: number) {
    if (pipe) {
      pipe(target, name, idx);
    }
    const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
    const metatype = ps[idx];
    const params: Array<ArgumentMetadata> =
      Reflect.getMetadata('mynest:params', target.constructor) ?? [];
    params.push({ index: idx, type: 'body', metatype, name });
    Reflect.defineMetadata('mynest:params', params, target.constructor);
  };
}

export function Query(data: string, pipe?: ParameterDecorator) {
  return function (target: any, name: string, idx: number) {
    if (pipe) {
      pipe(target, name, idx);
    }
    const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
    const metatype = ps[idx];
    const params: Array<ArgumentMetadata> =
      Reflect.getMetadata('mynest:params', target.constructor) ?? [];
    params.push({ index: idx, type: 'query', metatype, data, name });
    Reflect.defineMetadata('mynest:params', params, target.constructor);
  };
}
