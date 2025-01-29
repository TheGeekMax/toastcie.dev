<template>
    <div>
        <div class="project-thumb mx-4">
            <div class="project-thumb__image">
                <img :src="thumbnail" alt="Project Thumbnail" />
            </div>
            <div class="project-thumb__content">
                <h3>{{ title }}</h3>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>

</style>