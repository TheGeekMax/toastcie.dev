<template>
    <Footer>
        <p>Toastcie.dev &copy; {{ currentYear }}</p>
    </Footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style lang="css" scoped>
    footer {
        background-color: rgb(12,10,14);
        color: white;
        text-align: center;
        padding: 1rem;
        width: 100%;
        position: absolute;
        bottom: 0;
    }
</style>