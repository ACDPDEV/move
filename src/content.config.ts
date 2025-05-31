import { defineCollection, z } from "astro:content";

const simulators = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    href: z.string(),
    area: z.string(),
    image: z.string(),
  }),
});

export const collections = { simulators };
