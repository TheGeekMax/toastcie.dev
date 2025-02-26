<template>
    <div>
        <div class="project-thumb mx-4">
            <div class="project-thumb__image">
                <img :src="thumbnail" alt="Project Thumbnail" />
            </div>
            <div class="project-thumb__content">
                <a :href="url"> 
                <h3>{{ title }}</h3>
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { NuxtLink } from '#build/components';


export default {
    props: {
        title: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        url:{
            type : String,
            required: false,
            default: "/"
        }
    }
}
</script>

<style scoped>
.project-thumb__content{
    text-align: center;
}

.project-thumb__content h3{
    text-decoration: none;
    color: white;
}
</style>