<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2">
        <Icon name="uil:pen" class="w-8 h-8 text-neutral-600" />
        <span class="text-xl font-bold text-gray-900 dark:text-white">My Blog</span>
      </NuxtLink>
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <UButton
          to="/"
          variant="ghost"
          color="neutral"
          icon="i-heroicons-home"
        >
          Home
        </UButton>

        <UButton
          variant="ghost"
          color="neutral"
          :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
          @click="toggleColorMode"
        />
      </div>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>
