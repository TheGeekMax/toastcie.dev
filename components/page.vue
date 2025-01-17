<template>
    <div class="full text-align-center">
        <slot />
    </div>
</template>

<style>
    .full {
        width: 100%;
        height: 100vh;
        position: relative;
        scroll-snap-align: start center;
    }
</style> 