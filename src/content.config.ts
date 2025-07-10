import { defineCollection, z } from "astro:content";

const simulators = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    area: z.array(z.string().min(1).nonempty()),
    image: z.string(),
  }),
});

export const collections = { simulators };
