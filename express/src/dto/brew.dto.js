import { z } from 'zod';
import { registry } from '../openapi/registry.js';

export const BrewDTO = z.object({
    beans:  z.string().min(2),
    method: z.enum(['v60', 'aeropress', 'chemex', 'espresso']),
    rating: z.number().gt(0).lte(5).nullish().default(null),
    notes: z.string().max(200).nullish().default(null),
    brewed_at: z.string().datetime({local: true}).nullish().default((new Date()).toISOString())
});

export const BrewQuery = z.object({
    method: z.enum(['v60', 'aeropress', 'chemex', 'espresso']).optional(),
    rating: z.number().gt(0).lte(5).optional(),
});

registry.register('Brew', BrewDTO);
registry.register('BrewQuery', BrewQuery);