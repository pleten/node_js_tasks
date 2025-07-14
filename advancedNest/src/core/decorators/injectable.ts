import { container } from '../container';

export function Injectable() {
  return function (target: any) {
    const token = Reflect.getMetadata('inject:token', target) ?? target;
    container.register(token, target);
  };
}

export function Inject(token?: any) {
  return function (target: any) {
    if (token) {
      Reflect.defineMetadata('inject:token', token, target);
    }
  };
}
