import { ArgumentMetadata } from '../../core/types';
import { HttpException, PipeTransform } from '../../core';

export class IdToNumberPipe implements PipeTransform<any, any> {
  transform(value: unknown, meta: ArgumentMetadata) {
    const transformedValue =
      value !== undefined ? parseInt(<string>value) : undefined;
    if (transformedValue === undefined || !isNaN(transformedValue)) {
      return transformedValue;
    } else {
      throw new HttpException(
        400,
        `${meta.type}${meta.data ? ` (${meta.data})` : ''} has invalid number`,
      );
    }
  }
}
