import {NextFunction, Request, Response} from "express";

// eslint-disable-next-line no-unused-vars
export function notFound(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ error: 'Route not found' });
}