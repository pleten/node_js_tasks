import {Router} from 'express';
import {makeClassInvoker} from 'awilix-express';
import ZipController from '../controllers/zip.controller.js';
import multer from "multer";
const upload = multer({ dest: 'uploads/' });
const router = Router();
const ctl = makeClassInvoker(ZipController);

router.post(
    '/zip',
    upload.single('zipFile'),
    ctl('upload')
);

export {router};