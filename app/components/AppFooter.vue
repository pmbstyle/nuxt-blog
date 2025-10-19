<template>
  <UFooter>
    <template #left>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        © {{ new Date().getFullYear() }} My Blog. Built with Nuxt.
      </p>
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <UButton
          variant="ghost"
          color="secondary"
          to="https://github.com/pmbstyle/nuxt-blog"
          external
        >
        <Icon name="uil:github" class="w-4 h-4"/> GitHub
        </UButton>
        
        <UButton
          variant="ghost"
          color="secondary"
          to="mailto:slava@trofimov.ca"
        >
        <Icon name="uil:envelope" class="w-4 h-4"/> Contact
        </UButton>
      </div>
    </template>
  </UFooter>
</template>
