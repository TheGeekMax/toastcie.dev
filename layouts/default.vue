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