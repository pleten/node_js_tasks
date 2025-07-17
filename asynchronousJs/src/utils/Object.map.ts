export const objectMap = (obj: object, fn: Function) => {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('Expected an object');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }

  return Object.entries(obj).reduce((acc: any, [key, value]) => {
    acc[key] = fn(value, key, obj);
    return acc;
  }, {});
};