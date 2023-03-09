<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue'

const hi = '你好'
</script>

<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="标题" />
    {{ hi }}
  </div>
</template>
