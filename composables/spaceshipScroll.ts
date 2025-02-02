let generateColor = function(){
    let lerp = function(a: number, b: number, t: number){
        return a + (b-a)*t;
    }

    let colorLerp = function(r1:number, g1:number, b1:number, r2:number, g2:number, b2:number, t:number){
        return `rgb(${lerp(r1, r2, t)}, ${lerp(g1, g2, t)}, ${lerp(b1, b2, t)},${Math.random()})`;
    }

    return colorLerp(
        201, 68, 58,
        198, 209, 40,
        Math.random()
    );
}
function random(min: number, max: number): number {
    return (Math.random() * (max - min + 1)) + min;
}

export default function (document : Document) {
    let ship = document.getElementById('scrollspace');
    let particles = document.getElementById('shipparticle');

    //set size of canvas
    const CANVAS_WIDTH = 256;
    const CANVAS_HEIGHT = 256;
    particles?.setAttribute('width',`${CANVAS_WIDTH}px`);
    particles?.setAttribute('height', `${CANVAS_HEIGHT}px`);

    //set background of the canvas
    let ctx = (particles as HTMLCanvasElement).getContext('2d');
    if(ctx == null){
        return;
    }

    let part_list : {x: number, y: number, size: number, x_vel: number, y_vel: number, color: string}[] = [];


    const OCILATION = 1;

    setInterval(() => {
        //get global scroll percent
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 105;

        //set canvas opacity relative to scroll
        particles?.style.setProperty('opacity', `${105-scrollPercent}%`);

        ship?.style.setProperty('bottom', `calc(${random(-OCILATION, OCILATION)}px + ${scrollPercent}%)`);
        ship?.style.setProperty('right', `calc(${random(-OCILATION, OCILATION)}px + 12%)`);

        //gestions des particules
        
        //step 0 : clear canvas
        ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        part_list.forEach(e => {
            //step 1 : draw particle
            ctx.fillStyle = e.color;
            //set opacity for particle only
            ctx.globalAlpha = (CANVAS_HEIGHT-e.y)/CANVAS_HEIGHT;

            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size, 0, Math.PI*2);
            ctx.fill();
            
            //step 2 : move particle
            e.x += e.x_vel;
            e.y += e.y_vel;

            //step 3 : remove particle if too low
            if(e.y > CANVAS_HEIGHT){
                part_list.splice(part_list.indexOf(e),1);
            }
        });
    },10);

    setInterval(() => {
        if(random(0,2) > 1){
            return;
        }
        part_list.push({
            x: 128,
            y: 0,
            size: random(5,7),
            x_vel: random(-.5,.5),
            y_vel: random(2,4),
            color: generateColor()
        });
    },5)
}