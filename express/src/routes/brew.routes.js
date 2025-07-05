import {Router} from 'express';
import {z} from 'zod';
import {makeClassInvoker} from 'awilix-express';

import BrewController from '../controllers/brew.controller.js';
import {validate} from '../middlewares/validate.js';
import {registry} from '../openapi/registry.js';
import {BrewDTO, BrewQuery} from '../dto/brew.dto.js';
import {validateParams} from '../middlewares/validateParams.js';
import {validateQuery} from '../middlewares/validateQuery.js';

const router = Router();
const ctl = makeClassInvoker(BrewController);

const paramsSchema = z.object({
    id: z.string().describe('Brew ID')
});

router.get(
    '/brews',
    validateQuery(BrewQuery),
    ctl('index')
);
registry.registerPath({
    method: 'get',
    path: '/api/brews',
    tags: ['Brews'],
    request: {
        query: BrewQuery
    },
    responses: {
        200: {
            description: 'Array of brews',
            content: {'application/json': {schema: z.array(BrewDTO)}}
        }
    }
});

router.get(
    '/brews/:id',
    validateParams(paramsSchema),
    ctl('read')
);
registry.registerPath({
    method: 'get',
    path: '/api/brews/{id}',
    tags: ['Brews'],
    request: {params: paramsSchema},
    responses: {
        200: {description: 'Brew', content: {'application/json': {schema: BrewDTO}}},
        404: {description: 'Brew not found'}
    }
});

router.post(
    '/brews',
    validate(BrewDTO),
    ctl('create')
);
registry.registerPath({
    method: 'post',
    path: '/api/brews',
    tags: ['Brews'],
    request: {
        body: {required: true, content: {'application/json': {schema: BrewDTO}}}
    },
    responses: {
        201: {description: 'Created', content: {'application/json': {schema: BrewDTO}}},
        400: {description: 'Validation error'}
    }
});

router.put(
    '/brews/:id',
    validateParams(paramsSchema),
    validate(BrewDTO),
    ctl('update')
);
registry.registerPath({
    method: 'put',
    path: '/api/brews/{id}',
    tags: ['Brews'],
    request: {
        params: paramsSchema,
        body: {required: true, content: {'application/json': {schema: BrewDTO}}}
    },
    responses: {
        200: {description: 'Updated brew', content: {'application/json': {schema: BrewDTO}}},
        400: {description: 'Validation error'},
        404: {description: 'Brew not found'}
    }
});

router.delete(
    '/brews/:id',
    ctl('delete')
);
registry.registerPath({
    method: 'delete',
    path: '/api/brews/{id}',
    tags: ['Brews'],
    request: {params: paramsSchema},
    responses: {
        204: {description: 'Deleted'},
        404: {description: 'Brew not found'}
    }
});

export {router};