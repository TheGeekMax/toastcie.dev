<template>
    <div id="scrollspace">
        <img src="/pictures/space.svg" alt="spaceship">
        <canvas id="shipparticle"></canvas>
    </div>
    <Page class="night" >
        <div class="mega-center">
            <div class="">
                <div class="d-inline-flex">
                    <div class="d-inline">
                        <img src="/pictures/troma.jpg" alt="un beau tromatisme" class="profile" height="200px">
                    </div>
                    <div class="d-inline ms-4">
                        <h1>Maxime Sanciaume</h1>
                        <h2>juste un dev passionné</h2>
                        <h3>pour vous montrer mes projets</h3>
                    </div>
                </div>
            </div>
            <div class="">
                <NuxtLink to="#rprojs" class="menu btn btn-primary mx-2 mt-3">Projets récents</NuxtLink>
                <NuxtLink to="#" class="menu btn btn-primary mx-2 mt-3">Tous mes projets</NuxtLink>
                <NuxtLink to="#myparcours" class="menu btn btn-primary mx-2 mt-3">Mon parcours</NuxtLink>
                <NuxtLink to="#contactme" class="menu btn btn-primary mx-2 mt-3">Me contacter</NuxtLink>
            </div>
        </div>
    </Page>
    <Page id="rprojs" class="night mega-center" style="background: linear-gradient(180deg, var(--night-1) 0%, var(--night-1) 25%, var(--night-2) 75%, var(--night-2) 100%);">
        <h1 class="my-3">Mes nouveaux projets :</h1>
        <div class="centered">
            <IndexProjectthumb v-for="project in projects" :title="project.name" :thumbnail="project.picpath" :url="project.url" />
        </div>
    </Page>
    <Page id="myparcours" class="night mega-center" style="background: linear-gradient(180deg, var(--night-2) 0%, var(--night-2) 25%, var(--night-3) 75%, var(--night-3) 100%);">
        <h1>Mon Parcours</h1>
    </Page>
    <Page id="contactme" style="background-color: #123012">
        <h1>Me contacter</h1>
        <Toastfooter />
    </Page>
</template>

<style>
@import url("~/assets/css/nightSky.css");

:root{
    --night-1: rgba(15,24,33,1);
    --night-2: rgb(3, 38, 55);
    --night-3: rgb(94, 74, 54);
}

#scrollspace {
    position: fixed;
    display: inline;
    bottom: 0;
    right: 12%;
    width: 32px;
    height: 32px;
    z-index: 5;

    img {
        width: 256px;
        height: 32px;
    }
}


.menu {
    width:200px;
}

.profile {
    border-radius: 50%;
    border:5px solid #fff;
}

.centered {

    display: flex;
    width: 70%;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    overflow-x: scroll;
    margin: 0 auto;

    mask-image: linear-gradient(to right, transparent, black 2%, black 95%, transparent);
    

    /* style scrollbar */
    &::-webkit-scrollbar {
        height: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #eeece0;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #eeece0 transparent;

    /* Edge */
    & {
        scrollbar-width: thin;
        scrollbar-color: #eeece0 transparent;
    }
}

.mega-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
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

//call api/getProjects on server

const all = await useFetch("/api/project/getrecent");
const projects = ref(all.data);

onMounted(() => {
    nightSky(document);
    spaceshipScroll(document);
});
</script>

