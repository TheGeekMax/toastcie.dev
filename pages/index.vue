<template>
    <div class="scroll-watcher"></div>
    <Page class="night">
        <div class="mega-center">
            <div class="">
                <div class="d-inline-flex">
                    <div class="d-inline">
                        <img src="/pictures/troma.jpg" alt="un beau tromatisme" height="200px">
                    </div>
                    <div class="d-inline ms-4">
                        <h1>Maxime Sanciaume</h1>
                        <h2>juste un dev passioné</h2>
                        <h3>pour vous montrer mes projets</h3>
                    </div>
                </div>
            </div>
            <div class="">
                <a href="" class="btn-primary">a</a>
                <a href="" class="btn-primary">b</a>
                <a href="" class="btn-primary">c</a>
                <a href="" class="btn-primary">d</a>
                <a href="" class="btn-primary">e</a>
            </div>
        </div>
    </Page>
    <Page style="background-color: #301212;">
        <h1>Mes nouveaux projets :</h1>
    </Page>
    <Page style="background-color: #121230">
        <h1>Mon Parcours</h1>
    </Page>
    <Page style="background-color: #123012">
        <h1>Me contacter</h1>
        <Toastfooter />
    </Page>
</template>

<style>
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

canvas.night {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}

div.night{
    background-color: #0f1821;
}

.night div {
    position: relative;
    z-index: 2;
}
</style>

<script lang="ts" setup>
//partie du code pour gerer la class night

let generateColor = function(){
    let lerp = function(a: number, b: number, t: number){
        return a + (b-a)*t;
    }

    let colorLerp = function(r1:number, g1:number, b1:number, r2:number, g2:number, b2:number, t:number){
        return `rgb(${lerp(r1, r2, t)}, ${lerp(g1, g2, t)}, ${lerp(b1, b2, t)},${Math.random()})`;
    }

    return colorLerp(
        230, 229, 207,
        230, 217, 207,
        Math.random()
    );
}

onMounted(() => {

    let stars : any = {};
    let genIndex = 0;
    const nights = document.querySelectorAll('.night');
    nights.forEach(night => {
        // gerer le fond
        night.classList.add('text-white');

        // gerer les etoiles
        let current : any = {};
        const canvas = document.createElement('canvas');
        canvas.classList.add('night');
        canvas.width = (night as HTMLElement).offsetWidth;
        canvas.height = (night as HTMLElement).offsetHeight;
        current.parent = night;
        night.appendChild(canvas);
        current.doc = canvas;
        current.width = canvas.width;
        current.height = canvas.height;
        current.stars = [];
        for(let i = 0; i < 250; i ++){
            let star : any = {};
            star.x = Math.random() * current.width;
            star.y = Math.random() * current.height;
            star.size = (Math.random() * 2) + .5;
            star.color = generateColor();
            let speed = .125;
            star.xvelocity = (Math.random()*speed*2)-speed;
            star.yvelocity = (Math.random()*speed*2)-speed;
            current.stars.push(star);
        }
        stars[genIndex] = current;
        genIndex++;
    });

    setInterval(() => {
        for(let i = 0; i < Object.keys(stars).length; i++){
            let current = stars[i];
            let ctx = (current.doc as HTMLCanvasElement).getContext('2d');
            if(ctx){
                ctx.clearRect(0, 0, current.width, current.height);
                current.stars.forEach((star : any) => {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
                    ctx.fillStyle = star.color;
                    ctx.fill();
                    star.x += star.xvelocity;
                    star.y += star.yvelocity;
                    if(star.x > current.width){
                        star.x = 0;
                    }
                    if(star.x < 0){
                        star.x = current.width;
                    }
                    if(star.y > current.height){
                        star.y = 0;
                    }
                    if(star.y < 0){
                        star.y = current.height;
                    }
                });
            }
        }
    }, 1000 / 60);
});
</script>

