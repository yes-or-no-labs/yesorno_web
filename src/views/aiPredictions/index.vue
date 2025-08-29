<template>
    <div class="w-full min-h-screen">
        <iframe :src="`https://ai-dev.yesornolabs.xyz?token=${appStore.tomeState.token}`" frameborder="0" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" scrolling="auto" class="w-full min-h-screen"></iframe>
    </div>
</template>

<script setup>
import { store } from '@/store';


const appStore = store.useAppStore()


</script>