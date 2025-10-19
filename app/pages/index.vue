<script setup lang="ts">
const route = useRoute()
const page = computed(() => parseInt(route.query.page as string) || 1)
const postsPerPage = 3

// Get total count for pagination
const { data: totalCount } = await useAsyncData('blog-total-count', () => 
  queryCollection('blog')
    .where('draft', '=', false)
    .count()
)

// Calculate pagination
const totalPages = computed(() => Math.ceil((totalCount.value || 0) / postsPerPage))
const hasNextPage = computed(() => page.value < totalPages.value)
const hasPrevPage = computed(() => page.value > 1)

// Get paginated posts
const { data: posts } = await useAsyncData('blog-posts', () => 
  queryCollection('blog')
    .where('draft', '=', false)
    .order('publishedAt', 'DESC')
    .select('title', 'description', 'publishedAt', 'image', 'path', 'tags', 'author', 'readingTime')
    .skip((page.value - 1) * postsPerPage)
    .limit(postsPerPage)
    .all(),
  {
    watch: [page]
  }
)

const url = useRequestURL()
useSeoMeta({
  title: 'Simple Nuxt Blog',
  description: 'A minimal Nuxt Content blog.',
  ogTitle: 'Simple Nuxt Blog',
  ogDescription: 'A minimal Nuxt Content blog.',
  ogType: 'website',
  ogUrl: url.href,
  ogImage: posts.value?.[0]?.image,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <UContainer class="py-16">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to My Blog
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover insights, tutorials, and thoughts about web development, technology, and life.
        </p>
      </div>
    </UContainer>

    <UContainer class="pb-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Latest Posts</h2>
        <UBadge color="primary" variant="soft">
          {{ totalCount }} {{ totalCount === 1 ? 'Post' : 'Posts' }}
        </UBadge>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UCard 
          v-for="post in posts" 
          :key="post.path" 
          class="group cursor-pointer hover:shadow-lg transition-all duration-300"
          @click="navigateTo(post.path)"
        >
          <template #header>
            <div class="relative overflow-hidden rounded-lg">
              <NuxtImg 
                v-if="post.image" 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
                <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </template>

          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ post.title }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {{ post.description }}
            </p>

            <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                <span>{{ new Date(post.publishedAt).toLocaleDateString() }}</span>
              </div>
              <div v-if="post.readingTime" class="flex items-center gap-1">
                <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                <span>{{ post.readingTime }} min read</span>
              </div>
              <div v-if="post.author" class="flex items-center gap-1">
                <UIcon name="i-heroicons-user" class="w-4 h-4" />
                <span>{{ post.author }}</span>
              </div>
            </div>

            <div v-if="post.tags?.length" class="flex gap-1 flex-wrap">
              <UBadge 
                v-for="tag in post.tags" 
                :key="tag" 
                color="primary" 
                variant="soft" 
                size="xs"
              >
                {{ tag }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </div>

      <div v-if="totalPages > 1" class="mt-12">
        <div class="flex items-center justify-center gap-2">
          <UButton
            v-if="hasPrevPage"
            :to="`/?page=${page - 1}`"
            variant="outline"
            color="primary"
            icon="i-heroicons-chevron-left"
            size="sm"
          >
            Previous
          </UButton>

          <div class="flex items-center gap-1">
            <UButton
              v-for="pageNum in totalPages"
              :key="pageNum"
              :to="`/?page=${pageNum}`"
              :variant="pageNum === page ? 'solid' : 'outline'"
              :color="pageNum === page ? 'primary' : 'secondary'"
              size="sm"
              class="min-w-[40px] flex items-center justify-center"
            >
              {{ pageNum }}
            </UButton>
          </div>

          <UButton
            v-if="hasNextPage"
            :to="`/?page=${page + 1}`"
            variant="outline"
            color="primary"
            icon="i-heroicons-chevron-right"
            size="sm"
          >
            Next
          </UButton>
        </div>

        <div class="mt-4 text-center">
          <p size="sm" color="gray" class="text-gray-500 dark:text-gray-400">
            Showing {{ (page - 1) * postsPerPage + 1 }} to {{ Math.min(page * postsPerPage, totalCount || 0) }} of {{ totalCount }} posts
          </p>
        </div>
      </div>
    </UContainer>
  </div>
</template>
