// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error(err);

  res.status(err.status || 500).json({error: err.message || 'Server error'});
}