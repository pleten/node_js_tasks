import {Router} from 'express';
import {makeClassInvoker} from 'awilix-express';
import ZipController from '../controllers/zip.controller';

const router = Router();
const ctl = makeClassInvoker(ZipController);

router.post(
    '/zip',
    ctl('upload')
);

export {router};