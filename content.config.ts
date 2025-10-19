import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        publishedAt: z.date(),
        image: z.string().optional(),
        tags: z.array(z.string()).optional(),
        author: z.string().optional(),
        readingTime: z.number().optional(),
        draft: z.boolean().optional().default(false)
      })
    })
  }
})
