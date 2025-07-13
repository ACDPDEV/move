import { defineCollection, z } from "astro:content";

const simulationsDescription = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    area: z.array(z.string().min(1).nonempty()),
    image: z.string(),
  }),
});

const simulationsComponent = defineCollection({
  schema: z.object({
    name: z.string(),
  }),
});

export const collections = { 
  simulationsDescription: simulationsDescription,
  simulationsComponent: simulationsComponent,
};
