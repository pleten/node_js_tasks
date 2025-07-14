export function Controller(prefix = '') {
  return function (target: any) {
    Reflect.defineMetadata('mynest:prefix', prefix, target);
  };
}

export const isController = (target: any) => {
  return Reflect.hasMetadata('mynest:prefix', target);
};
