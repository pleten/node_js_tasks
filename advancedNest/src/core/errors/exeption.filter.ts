import { HttpException } from './http.exeption';
import { FilterCatch, Injectable } from '../decorators';
import { Response } from 'express';

const parseErrorMessage = (message: string): string | object => {
  try {
    return JSON.parse(message);
  } catch {
    return message;
  }
};

@Injectable()
export class ExceptionFilter implements FilterCatch {
  catch(exception: any, res: Response) {
    if (exception && !(exception instanceof HttpException)) {
      res.status(500).json({ error: 'Internal server error' });
    } else if (exception) {
      res.status(exception.status || 500).json({
        error: parseErrorMessage(exception.message) || 'Internal server error',
      });
    }
  }
}
