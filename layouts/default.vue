<template>
    <slot />
</template>

<style>
    body{
        padding: 0;
        margin: 0;
        background-color: rgb(12,10,14);
        color: white;
    }

    html{
        overflow-x: hidden;
        scroll-snap-type: y mandatory;
    }
</style>

<script lang="ts" setup>
useSeoMeta({
  title: 'Maxime Sanciaume',
  description: 'Mon site de projets',
  ogTitle: 'Maxime Sanciaume',
  ogDescription: 'Mon site de projets',
  ogImage: '/pictures/troma.jpg',
  ogUrl: 'https://toastcie.dev',
  twitterTitle: 'Maxime Sanciaume',
  twitterDescription: 'Mon site de projets',
  twitterImage: '/pictures/troma.jpg',
  twitterCard: 'summary'
})
</script>