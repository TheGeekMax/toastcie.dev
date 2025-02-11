<template>
    <div class="mega-center">
        <canvas id="ca">

        </canvas>
        <a href="">clear</a>
        <a href="">free draw</a>
        <a href="">restart</a>
        <a href="">export</a>
    </div>
</template>

<script lang="ts" setup>
let canvas : HTMLCanvasElement;
let ctx : CanvasRenderingContext2D|null;

const WIDTH = 600;
const HEIGHT = 600;
const CELL_SIZE = 5;
const COLOR_STEP = 0.2;

const cols = WIDTH / CELL_SIZE;
const rows = HEIGHT / CELL_SIZE;

const curHue = ref(1);

const grid : number[][] = new Array(cols).fill(null).map(() => new Array(rows).fill(0));

onMounted(() => {
    canvas = document.getElementById("ca") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");

    if(!ctx){
        console.error("Canvas not supported");
        return;
    }

    //setup canvas
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    fillgrid();
    clear();

    //add click event
    canvas.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const draw = (event: MouseEvent) => {
            const x = Math.floor(event.offsetX / CELL_SIZE);
            const y = Math.floor(event.offsetY / CELL_SIZE);

            if (x < 0 || x >= cols || y < 0 || y >= rows) {
                return;
            }

            grid[x][y] = curHue.value;
            curHue.value += COLOR_STEP;

            if(curHue.value > 360) curHue.value = 1;
        };

        draw(e as MouseEvent);

        const stopDrawing = () => {
            canvas.removeEventListener("mousemove", draw);
            window.removeEventListener("mouseup", stopDrawing);
        };

        canvas.addEventListener("mousemove", draw);
        window.addEventListener("mouseup", stopDrawing);
    });

    setInterval(() => {
        step();
        clear();
        showGrid();
    }, 20);
})

function fillgrid(){
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j] = Math.floor(0); // TODO : change to color
        }
    }
}

function clear(){
    if(!ctx){
        return;
    }

    ctx.fillStyle = "#07083b";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function step(){
    //step 0 : create a new grid
    const newGrid : number[][] = new Array(cols).fill(null).map(() => new Array(rows).fill(0));

    //step 1 : compute the new grid
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            const state = grid[i][j];

            let neighbors : number[][] = [];
            if(isEmpty(i-1,j+1,grid)){
                neighbors.push([i-1,j+1]);
            }

            if(isEmpty(i+1,j+1,grid)){
                neighbors.push([i+1,j+1]);
            }

            if(state != 0 && isEmpty(i,j+1,newGrid)){
                newGrid[i][j+1] = grid[i][j];
            }else if(state != 0 && neighbors.length != 0){
                const random = Math.floor(Math.random() * neighbors.length);
                let [x,y] = neighbors[random];
                newGrid[x][y] = grid[i][j];
            }else if (state != 0){
                newGrid[i][j] = grid[i][j];
            }
        }
    }

    //step 2 : update the grid
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j] = newGrid[i][j];
        }
    }
}

function isEmpty(x : number, y : number, otherGrid:number[][]) : boolean{
    if(x < 0 || x >= cols || y < 0 || y >= rows){
        return false;
    }
    return grid[x][y] === 0 && otherGrid[x][y] === 0;
}

function showGrid(){
    if(!ctx){
        return;
    }

    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            const x = i * CELL_SIZE;
            const y = j * CELL_SIZE;

            if(grid[i][j] != 0){
                //let [r,g,b] = HSVtoRGB(120,100,100)
                ctx.fillStyle = 'hsl(' + grid[i][j] + ',100%,50%)'
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function HSVtoRGB(h : number, s : number, v : number) {
    var r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        default: r = v, g = p, b = q; break; // case 5
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ]
}
</script>

<style lang="css" scoped>

</style>