<template>
    <canvas id="voronoi"></canvas>
</template>

<script lang="ts" setup>
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

const WIDTH = 600;
const HEIGHT = 600;
const POINT_ZONE_WIDTH = ref(20);
const POINT_ZONE_HEIGHT = ref(20);
const SCALE = 2; // Reduce resolution by this factor (higher = faster but more pixelated)

let maxdistsq: number;

type Point = {
    x: number;
    y: number;
};

let points: Array<Point> = [];
let imageData: ImageData;

const generatePoints = () => {
    points = [];
    for (let i = 0; i < WIDTH; i += POINT_ZONE_WIDTH.value) {
        for (let j = 0; j < HEIGHT; j += POINT_ZONE_HEIGHT.value) {
            points.push({
                x: i + Math.random() * POINT_ZONE_WIDTH.value,
                y: j + Math.random() * POINT_ZONE_HEIGHT.value
            });
        }
    }

    // Calculate max distance
    maxdistsq = WIDTH * WIDTH + HEIGHT * HEIGHT;
}

const movePoints = (dx: number, dy: number) => {
    for (let i = 0; i < points.length; i++) {
        points[i].x += Math.random() * dx * 2 - dx;
        points[i].y += Math.random() * dy * 2 - dy;
        
        // Boundary checking
        points[i].x = Math.max(0, Math.min(WIDTH - 1, points[i].x));
        points[i].y = Math.max(0, Math.min(HEIGHT - 1, points[i].y));
    }
}

const showPoints = () => {
    if (!ctx) {
        console.error('Could not get 2d context');
        return;
    }
    
    // Clear the canvas with a black background
    const data = imageData.data;
    
    // Process at lower resolution
    const scaledWidth = Math.ceil(WIDTH / SCALE);
    const scaledHeight = Math.ceil(HEIGHT / SCALE);
    
    // For each pixel at reduced resolution
    for (let i = 0; i < scaledWidth; i++) {
        for (let j = 0; j < scaledHeight; j++) {
            // Convert back to full resolution
            const x = i * SCALE;
            const y = j * SCALE;
            
            let minDist = maxdistsq;
            let minIndex = -1;
            
            // Find closest point
            for (let k = 0; k < points.length; k++) {
                const dx = points[k].x - x;
                const dy = points[k].y - y;
                
                // Early optimization: if we're already outside the possible minimum, skip
                if (Math.abs(dx) > minDist || Math.abs(dy) > minDist) continue;
                
                const distsq = dx * dx + dy * dy;
                if (distsq < minDist) {
                    minDist = distsq;
                    minIndex = k;
                }
            }
            
            if (minIndex !== -1) {
                const color = Math.floor(255 * Math.sqrt(minDist)**1.45 / Math.sqrt(maxdistsq));
                
                // Fill SCALE×SCALE block of pixels at once
                for (let sx = 0; sx < SCALE && x + sx < WIDTH; sx++) {
                    for (let sy = 0; sy < SCALE && y + sy < HEIGHT; sy++) {
                        const idx = 4 * ((y + sy) * WIDTH + (x + sx));
                        data[idx] = color;     // R
                        data[idx + 1] = color; // G
                        data[idx + 2] = color; // B
                        data[idx + 3] = 255;   // A (fully opaque)
                    }
                }
            }
        }
    }
    
    // Put the image data back to the canvas
    ctx.putImageData(imageData, 0, 0);
}

generatePoints();

onMounted(() => {
    canvas = document.getElementById('voronoi') as HTMLCanvasElement;
    ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    if (!ctx) {
        console.error('Could not get 2d context');
        return;
    }
    
    // Create ImageData once
    imageData = ctx.createImageData(WIDTH, HEIGHT);
    
    // Fill with black initially
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;      // R
        data[i + 1] = 0;  // G
        data[i + 2] = 0;  // B
        data[i + 3] = 255; // A
    }
    
    setInterval(() => {
        showPoints();
        movePoints(3, 3);
    }, 10);
});
</script>

<style lang="css" scoped>
canvas {
    display: block;
    margin: 0 auto;
}
</style>