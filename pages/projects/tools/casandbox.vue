<template>
    <div class="mega-center">
        <div>
            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" name="btnradio" id="color_rb" autocomplete="off" @click="color_set_rainbow" checked>
                <label class="btn btn-outline-primary" for="color_rb">Rainbow</label>

                <input type="radio" class="btn-check" name="btnradio" id="color_bw" autocomplete="off" @click="color_set_bw">
                <label class="btn btn-outline-primary" for="color_bw">B/W</label>
            </div>
            <p>auto remove <input type="checkbox" v-model="autoRemove" /></p>
            <button @click="reset">clear</button>
            <input class="d-none" type="checkbox" id="playcheckbox" v-model="play"/>
            <label class="btn btn-primary" for="playcheckbox">  {{ playLabel }}</label>
        </div>
        <canvas id="ca">

        </canvas>
        <div>
            <input type="number" v-model="ruleNumber" @change="calcRule" />
            <p>run CA dim 1 <input type="checkbox" v-model="c1drun" /></p>

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
        </div>
    </div>
</template>

<script lang="ts" setup>
let canvas : HTMLCanvasElement;
let ctx : CanvasRenderingContext2D|null;

let drawing = false;
let penX = 0;
let penY = 0;

const WIDTH = 600;
const HEIGHT = 600;
const CELL_SIZE = 5;
const COLOR_STEP = 0.5;

const cols = WIDTH / CELL_SIZE;
const rows = HEIGHT / CELL_SIZE;

const curHue = ref(1);


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

//labels
const playLabel = computed(() => play.value ? "play" : "pause");

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
    curHue.value += COLOR_STEP;

    if(curHue.value > 360) curHue.value = 1;
}

//for radiobutton handling

function color_set_rainbow(){
    color_rainbow.value = true;
}

function color_set_bw(){
    color_rainbow.value = false;
}

//for 1D CA calcs

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
    curHue.value += COLOR_STEP;
    if(curHue.value > 360) curHue.value = 1;
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

<style lang="css" scoped>
.mega-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
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
</style>