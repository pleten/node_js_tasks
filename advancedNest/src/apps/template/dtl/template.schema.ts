import { z } from 'zod';

export const templateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  rating: z.number().nullish(),
});
