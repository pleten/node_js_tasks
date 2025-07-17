import express from 'express';
import cors from 'cors';
import { container } from './container.js';
import { scopePerRequest } from 'awilix-express';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { router as zipRouter } from './routes/zip.routes.js';
import {asyncHandler} from "./middlewares/asyncHandler.js";
import { addRequestId } from "./middlewares/addRequestId.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(addRequestId());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(scopePerRequest(container));

  app.use('/zip', express.raw({ type: 'application/zip', limit: '50mb' }));
  app.use('/', asyncHandler(zipRouter));

  app.use(notFound);

  app.use(errorHandler);

  return app;
}