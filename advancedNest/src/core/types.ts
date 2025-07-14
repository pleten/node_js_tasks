import { ParamType } from './utils';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export interface ArgumentMetadata {
  readonly index: number;
  readonly type: ParamType;
  readonly metatype?: Type;
  readonly data?: string;
  readonly name?: string;
}
