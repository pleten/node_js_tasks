export function Module(metadata: {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
  exports?: any[];
}) {
  return function (target: any) {
    Reflect.defineMetadata('mynest:module', metadata, target);
  };
}
