<!-- eslint-disable no-unused-vars -->
<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
</script>
<template>
  <main>
    <router-view />
  </main>
</template>
