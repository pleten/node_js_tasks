export class HttpException extends Error {
  cause: unknown;
  constructor(
    readonly status: number,
    message: string | object,
  ) {
    super();

    this.message =
      typeof message !== 'string' ? JSON.stringify(message) : message;
    this.name = 'HttpError';
    Error.captureStackTrace(this, this.constructor);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpException);
    }
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}
