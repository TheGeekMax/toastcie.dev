export default function (document : Document) {

    function random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    let ship = document.getElementById('scrollspace');

    const OCILATION = 1;

    setInterval(() => {
        //get global scroll percent
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 105;


        ship?.style.setProperty('bottom', `calc(${random(-OCILATION, OCILATION)}px + ${scrollPercent}%)`);
        ship?.style.setProperty('right', `calc(${random(-OCILATION, OCILATION)}px + 12%)`);
    },10);
}