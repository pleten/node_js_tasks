type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export function Route(method: Method, path = '') {
  return function (target: any, key: string) {
    const routes =
      Reflect.getMetadata('mynest:routes', target.constructor) ?? [];
    routes.push({ method, path, handlerName: key });
    Reflect.defineMetadata('mynest:routes', routes, target.constructor);
  };
}

export const Get = (p = '') => Route('get', p);
export const Post = (p = '') => Route('post', p);
export const Put = (p = '') => Route('put', p);
export const Patch = (p = '') => Route('patch', p);
export const Delete = (p = '') => Route('delete', p);
