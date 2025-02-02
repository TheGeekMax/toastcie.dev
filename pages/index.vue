<template>
    <div class="scroll-watcher"></div>
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
                        <h2>juste un dev passioné</h2>
                        <h3>pour vous montrer mes projets</h3>
                    </div>
                </div>
            </div>
            <div class="">
                <NuxtLink to="#rprojs" class="menu btn btn-primary mx-2 mt-3">Projets reecents</NuxtLink>
                <NuxtLink to="#" class="menu btn btn-primary mx-2 mt-3">Tout mes projets</NuxtLink>
                <NuxtLink to="#myparcours" class="menu btn btn-primary mx-2 mt-3">Mon parcours</NuxtLink>
                <NuxtLink to="#contactme" class="menu btn btn-primary mx-2 mt-3">Me contacter</NuxtLink>
            </div>
        </div>
    </Page>
    <Page id="rprojs" class="night mega-center">
        <h1 class="my-3">Mes nouveaux projets :</h1>
        <div class="centered">
            <IndexProjectthumb v-for="project in projects" :title="project.name" :thumbnail="project.picpath" />
        </div>
    </Page>
    <Page id="myparcours" class="night" style="background-color: #121230">
        <h1>Mon Parcours</h1>
    </Page>
    <Page id="contactme" style="background-color: #123012">
        <h1>Me contacter</h1>
        <Toastfooter />
    </Page>
</template>

<style>
@import url("~/assets/css/nightSky.css");

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
    width:150px;
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

/* for scroll animation */
.scroll-watcher{
    position: fixed;
    top: 0;
    width: 100%;
    height: 5px;
    z-index: 1000;
    background-color: rgb(7, 118, 118);
    scale: 0 1;
    transform-origin: left;

    animation: scroll-watcher linear;
    animation-timeline: scroll();
}

@keyframes scroll-watcher{
    to {
        scale: 1 1;
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

//call api/getProjects on server

const all = await useFetch("/api/project/getrecent");
const projects = ref(all.data);

onMounted(() => {
    nightSky(document);
    spaceshipScroll(document);
});
</script>

