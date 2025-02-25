<template>
    <div class="mega-center">
        <div id="control-left">
            <h2>Sandbox</h2>
            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" name="btnradio" id="color_rb" autocomplete="off" @click="color_set_rainbow" checked>
                <label class="btn btn-outline-primary" for="color_rb">Rainbow</label>

                <input type="radio" class="btn-check" name="btnradio" id="color_bw" autocomplete="off" @click="color_set_bw">
                <label class="btn btn-outline-primary" for="color_bw">B/W</label>
            </div>
            <p><div id="colordivshow" :style="`background-color: hsl(${curHue}, 100%, 50%)`"></div> {{ curHue }}</p>
            
            <input id="color_range" type="range" min="1" max="360" step="0.5" value="1" @input="update_hue($event)"/>
            <p>auto hue <input type="checkbox" v-model="autohue" /></p>
            <p>hue step <input type="number" v-model="COLOR_STEP" step="0.5" /></p>
            <p>auto remove <input type="checkbox" v-model="autoRemove" /></p>
            <button class="btn btn-primary" @click="reset">clear</button>
            <label class="btn btn-primary" for="playcheckbox">  {{ playLabel }}</label>

            <input class="d-none" type="checkbox" id="playcheckbox" v-model="play"/>
        </div>
        <canvas id="ca">
        </canvas>
        <div id="control-right">
            <h2>1D cellular</h2>
            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" name="ctype" id="ca_none" autocomplete="off" @click="set_type(c1type.None)">
                <label class="btn btn-outline-primary" for="ca_none">None</label>

                <input type="radio" class="btn-check" name="ctype" id="ca_center" autocomplete="off" @click="set_type(c1type.Center)" checked>
                <label class="btn btn-outline-primary" for="ca_center">Center</label>

                <input type="radio" class="btn-check" name="ctype" id="ca_random" autocomplete="off" @click="set_type(c1type.Random)">
                <label class="btn btn-outline-primary" for="ca_random">Random</label>
            </div>
            <p>run 1d simulation <input type="checkbox" v-model="c1drun" /></p>

            <input type="number" v-model="ruleNumber" @change="calcRule" />
            

            <div class="input-group">
                <span class="input-group-text">1</span>
                <span class="input-group-text">2</span>
                <span class="input-group-text">4</span>
                <span class="input-group-text">8</span>
                <span class="input-group-text">16</span>
                <span class="input-group-text">32</span>
                <span class="input-group-text">64</span>
                <span class="input-group-text">128</span>
            </div>
            <div class="input-group">
                <input class="form-check-input" type="checkbox" v-model="rules[0].value" @change="calcRuleNumber(0)"/>
                <input class="form-check-input" type="checkbox" v-model="rules[1].value" @change="calcRuleNumber(1)"/>
                <input class="form-check-input" type="checkbox" v-model="rules[2].value" @change="calcRuleNumber(2)"/>
                <input class="form-check-input" type="checkbox" v-model="rules[3].value" @change="calcRuleNumber(3)"/>
                <input class="form-check-input" type="checkbox" v-model="rules[4].value" @change="calcRuleNumber(4)"/>
                <input class="form-check-input" type="checkbox" v-model="rules[5].value" @change="calcRuleNumber(5)"/>
                <input class="form-check-input" type="checkbox" v-model="rules[6].value" @change="calcRuleNumber(6)"/>
                <input class="form-check-input" type="checkbox" v-model="rules[7].value" @change="calcRuleNumber(7)"/>
            </div>
            <button class="btn btn-primary" @click="reset1dca">reset 1D simulation simulation</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Sandbox x 1D CA',
  description: 'petit projet qui melange automate cellulaire de dimentios 1 et 2. avec un peu de couleur et beaucoup (beaucoup de sable)',
  ogTitle: 'Sandbox x 1D CA',
  ogDescription: 'petit projet qui melange automate cellulaire de dimentios 1 et 2. avec un peu de couleur et beaucoup (beaucoup de sable)',
  ogImage: '/pictures/thumbnail/casandbox.png',
  ogUrl: 'https://toastcie.dev',
  twitterTitle: 'Sandbox x 1D CA',
  twitterDescription: 'petit projet qui melange automate cellulaire de dimentios 1 et 2. avec un peu de couleur et beaucoup (beaucoup de sable)',
  twitterImage: '/pictures/thumbnail/casandbox.png',
  twitterCard: 'summary'
})

enum c1type{
    None,
    Center,
    Random,
}

let canvas : HTMLCanvasElement;
let ctx : CanvasRenderingContext2D|null;
let color_range : HTMLInputElement;

let drawing = false;
let penX = 0;
let penY = 0;

const WIDTH = 600;
const HEIGHT = 600;
const CELL_SIZE = 5;
const COLOR_STEP = ref(0.5);

const cols = WIDTH / CELL_SIZE;
const rows = HEIGHT / CELL_SIZE;

const curHue : Ref<number> = ref(1);
const autohue : Ref<Boolean> = ref(true);

const grid : number[][] = new Array(cols).fill(null).map(() => new Array(rows).fill(0));

const ca : number[] = new Array(cols).fill(0);

const ruleNumber : Ref<number> = ref(126);
const play : Ref<boolean> = ref(true);
const c1drun : Ref<boolean> = ref(false);
const autoRemove : Ref<Boolean> = ref(false);
const rules : Ref<boolean>[] = [
    ref(false), ref(false), ref(false), ref(false), ref(false), ref(false), ref(false), ref(false)
];

const color_rainbow : Ref<boolean> = ref(true);
const ctype : Ref<c1type> = ref(c1type.Center);

//labels
const playLabel = computed(() => play.value ? "pause" : "play");

onMounted(() => {
    canvas = document.getElementById("ca") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");
    color_range = document.getElementById("color_range") as HTMLInputElement;

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
            penX = event.offsetX;
            penY = event.offsetY;
        };

        draw(e as MouseEvent);

        const stopDrawing = () => {
            drawing = false;
            canvas.removeEventListener("mousemove", draw);
            window.removeEventListener("mouseup", stopDrawing);
        };
        drawing = true;
        penX = e.offsetX;
        penY = e.offsetY;
        canvas.addEventListener("mousemove", draw);
        window.addEventListener("mouseup", stopDrawing);
    });
    
    let frame = 0;
    calcRule();
    setInterval(() => {
        curHue.value = curHue.value as number;
        clear();
        showGrid();

        if(!play.value){
            return;
        }

        d2step();
        if(c1drun.value && frame % 2  == 1){
            d1step();
            copyond2();
            frame = -1;
        }
        frame ++;
    }, 20);

    setInterval(() => {
        draw_pixel();
    })
})

function draw_pixel(){
    if(!ctx){
        return;
    }

    if(!drawing){
        return;
    }

    const x = Math.floor(penX / CELL_SIZE);
    const y = Math.floor(penY / CELL_SIZE);

    if (x < 0 || x >= cols || y < 0 || y >= rows) {
        return;
    }

    grid[x][y] = curHue.value;
    curHue.value += COLOR_STEP.value*(autohue.value?1:0);


    if(curHue.value > 360) curHue.value -= 360;

    color_range.value = curHue.value.toString();
}

//for radiobutton handling

function color_set_rainbow(){
    color_rainbow.value = true;
}

function color_set_bw(){
    color_rainbow.value = false;
}

function update_hue(event: Event){
    curHue.value = Number((event.target as HTMLInputElement).value);
}

function set_type (type: c1type){
    ctype.value = type;
}

//for 1D CA calcs

function reset1dca(){
    switch(ctype.value){
        case c1type.None:
            ca.fill(0);
            break;
        case c1type.Center:
            ca.fill(0);
            ca[Math.floor(cols/2)] = 1;
            break;
        case c1type.Random:
            for(let i = 0; i < cols; i++){
                ca[i] = Math.floor(Math.random() * 2);
            }
            break;
    }
}

function calcRule(){
    let rule = ruleNumber.value;
    for(let i = 0; i < 8; i++){
        rules[i].value = rule % 2 == 1;
        rule = Math.floor(rule / 2);
    }
}

function calcRuleNumber(i : number){
    let rule = 0;
    for(let i = 7; i >= 0; i--){
        rule *= 2;
        rule += rules[i].value?1:0;
    }
    ruleNumber.value = rule;
    console.log(rule);
}

function getCell(x: number ): number{
    if(x < 0 || x >= cols){
        return 0;
    }

    return ca[x]
}

function getRuleNumber(x:number):number{
    return getCell(x-1)*4 + getCell(x)*2 + getCell(x+1);
}

function getNextCell(x:number):number{
    return rules[getRuleNumber(x)].value ? 1 : 0;
}

function d1step(){
    const newCA : number[] = new Array(cols).fill(0);

    for(let i = 0; i < cols; i++){
        newCA[i] = getNextCell(i);
    }

    for(let i = 0; i < cols; i++){
        ca[i] = newCA[i];
    }
}

function copyond2(){
    for(let i = 0; i < cols; i++){
        grid[i][0] = ca[i]*curHue.value;
    }
    curHue.value += COLOR_STEP.value *(autohue.value?1:0);
    if(curHue.value > 360) curHue.value -= 360;
    color_range.value = curHue.value.toString();
}


// for 2D CA

function fillgrid(){
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j] = Math.floor(0);
        }
    }

    ca[ Math.floor(cols / 2)] = 1;
}

function reset(){
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j] = Math.floor(0);
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

function d2step(){
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

function shift(){
    const newGrid : number[][] = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
    
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows-1; j++){
            newGrid[i][j+1] = grid[i][j];
        }
    }
    
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

    let full = true;

    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            const x = i * CELL_SIZE;
            const y = j * CELL_SIZE;

            if(grid[i][j] != 0){
                //let [r,g,b] = HSVtoRGB(120,100,100)
                if(color_rainbow.value){
                    ctx.fillStyle = 'hsl(' + grid[i][j] + ',100%,50%)'
                }else{
                    ctx.fillStyle = 'white';
                }
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }
            if(j >= rows-5 && grid[i][j] == 0){
                full = false;
            }
        }
    }

    if(autoRemove.value && full){
        shift();
    }
}
</script>

<style lang="css">

:root {
    --control-radius: 30px;
    --control-background: #07062b;
    --control-border: #4318a0;
}

#color_range{
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet,red);
    height: 8px;
    border-radius: 5px;
    outline: none;
    opacity: 0.7;
    transition: opacity .2s;
}

.mega-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: row;
    justify-content: space-between;
}

.form-check-input{
    width:30px;
    height:30px;
}
.input-group-text{
    width:30px;
    height:30px;
    text-align:center;
    padding:2px;
}

#colordivshow{
    display:inline-block;
    width: 32px;
    height: 32px;
    border: 1px solid black;
}

#control-left{
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    padding: 50px;
    border-top: solid 5px var(--control-border);
    border-right: solid 5px var(--control-border);
    border-bottom: solid 5px var(--control-border);
    border-radius: 0px var(--control-radius) var(--control-radius) 0px;
    background: var(--control-background);
    min-width: 20%;
    min-height:50vh;
}

#control-left > * {
    margin-bottom: 15px;
    width: 100%;
}

#control-right{
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    padding: 50px;
    border-top: solid 5px var(--control-border);
    border-left: solid 5px var(--control-border);
    border-bottom: solid 5px var(--control-border);
    border-radius: var(--control-radius) 0px 0px var(--control-radius);
    background: var(--control-background);
    min-width: 20%;
    min-height:50vh;
} 

#control-right > * {
    margin-bottom: 15px;
    width: 100%;
}
</style>