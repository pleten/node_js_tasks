import { ZodSchema } from 'zod';
import { HttpException, PipeTransform } from '../../core';

export class ZodValidationPipe implements PipeTransform<any, any> {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (err: any) {
      throw new HttpException(400, err.message);
    }
  }
}
