<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(`post:${route.fullPath}`, () =>
  queryCollection('blog').path(route.fullPath).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const url = useRequestURL()
useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogType: 'article',
  ogImage: url.origin + '/' + post.value.image,
  ogUrl: url.href,
  twitterCard: 'summary_large_image',
  articlePublishedTime: post.value.publishedAt
})

useHead({
  link: [{ rel: 'canonical', href: `${url.origin}${post.value.path}` }],
  meta: post.value.author ? [{ name: 'author', content: post.value.author }] : []
})

const sharePost = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: post.value?.title,
        text: post.value?.description,
        url: url.href
      })
    } catch (err) {
      console.log('Error sharing:', err)
    }
  } else {
    await navigator.clipboard.writeText(url.href)
  }
}
</script>

<template>
  <div v-if="post" class="min-h-screen bg-gray-50 dark:bg-gray-900">

    <UContainer class="pb-16 mt-16">
      <UCard class="overflow-hidden">
        <template #header>
          <div class="space-y-6">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {{ post.title }}
            </h1>

            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                <span>{{ new Date(post.publishedAt).toLocaleDateString() }}</span>
              </div>
              <div v-if="post.readingTime" class="flex items-center gap-2">
                <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                <span>{{ post.readingTime }} min read</span>
              </div>
              <div v-if="post.author" class="flex items-center gap-2">
                <UIcon name="i-heroicons-user" class="w-4 h-4" />
                <span>By {{ post.author }}</span>
              </div>
            </div>

            <div v-if="post.tags?.length" class="flex gap-2 flex-wrap">
              <UBadge 
                v-for="tag in post.tags" 
                :key="tag" 
                color="primary" 
                variant="soft"
                size="sm"
              >
                {{ tag }}
              </UBadge>
            </div>

            <div v-if="post.image" class="relative overflow-hidden rounded-lg">
              <NuxtImg 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-64 md:h-80 object-cover"
              />
            </div>

            <p v-if="post.description" class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ post.description }}
            </p>
          </div>
        </template>

        <div class="prose prose-lg max-w-none dark:prose-invert">
          <ContentRenderer :value="post" />
        </div>

        <template #footer>
          <div class="flex items-center justify-between pt-6 border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <UButton
                to="/"
                variant="ghost"
                color="primary"
                icon="i-heroicons-arrow-left"
                size="sm"
              >
                Back to Blog
              </UButton>
            </div>
            
            <div class="flex items-center gap-2">
              <UButton
                variant="ghost"
                color="primary"
                icon="i-heroicons-share"
                size="sm"
                class="cursor-pointer"
                @click.prevent="sharePost"
              >
                Share
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </UContainer>
  </div>
</template>
