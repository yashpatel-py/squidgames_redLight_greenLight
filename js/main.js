const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xb7c3f3, 1);

const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

// creating global variablesc
const start_position = 3;
const end_position = -start_position;
const text = document.querySelector(".text");
const TIME_LIMIT = 10;
let gameStat = "loading"
let isLookingBackword = true

function createCube(size, positionX, rotY = 0, color = 0xfbc851) {
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = positionX;
    cube.rotation.y = rotY;
    scene.add(cube);
    return cube;
}

camera.position.z = 5;

// Instantiate a loader
const loader = new THREE.GLTFLoader();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// creating doll class
class Doll {
    constructor() {
        loader.load("../models/scene.gltf", (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.scale.set(0.30, 0.30, 0.30);
            gltf.scene.position.set(0, -1, 0);
            this.doll = gltf.scene;
        });
    }

    lookBackword() {
        // this.doll.rotation.y = -3.15;
        gsap.to(this.doll.rotation, { duration: 0.5, y: -3.15 });
        setTimeout(() => isLookingBackword = true, 150);
    }

    lookForward() {
        gsap.to(this.doll.rotation, { duration: 0.45, y: 0 });
        setTimeout(() => isLookingBackword = false, 450);
    }

    async start(){
        this.lookBackword();
        await delay((Math.random() * 1000) + 1000);
        this.lookForward();
        await delay((Math.random() * 750) + 760);
        this.start();
    }
}

function createTrack() {
    createCube(
        { w: start_position * 2 + 0.2, h: 1.5, d: 1 },
        0,
        0,
        0xe5a716
    ).position.z = -1;
    createCube({ w: 0.2, h: 1.5, d: 1 }, start_position, -0.35);
    createCube({ w: 0.2, h: 1.5, d: 1 }, end_position, 0.35);
}
createTrack();

class Player {
    constructor() {
        const geometry = new THREE.SphereGeometry(0.3, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.z = 1;
        sphere.position.x = start_position;
        scene.add(sphere);
        this.player = sphere;
        this.playerInfo = {
            positionX: start_position,
            valocity: 0,
        };
    }

    run() {
        this.playerInfo.valocity = .03;
    }

    stop() {
        gsap.to(this.playerInfo, { duration: .1, valocity: 0 });
    }

    check(){
        if(this.playerInfo.valocity > 0 && !isLookingBackword){
            text.innerHTML = "You lost!";
            gameStat = "over";
        }

        if(this.playerInfo.positionX < end_position + .4){
            text.innerHTML = "You Win!";
            gameStat = "over";
        }
    }

    update() {
        this.check();
        this.playerInfo.positionX -= this.playerInfo.valocity;
        this.player.position.x = this.playerInfo.positionX;
    }
}

const player = new Player();

let doll = new Doll();

// Game logic
async function init() {
    await delay(500);
    text.innerHTML = "Starting in 3";
    await delay(500);
    text.innerHTML = "Starting in 2";
    await delay(500);
    text.innerHTML = "Starting in 1";
    await delay(500);
    text.innerHTML = "Goo!!! ";
    startGame();
}

function startGame() {
    gameStat = "started"
    let progressBar = createCube({ w: 5, h: .1, d: 1}, 0)
    progressBar.position.y = 3.35;
    gsap.to(progressBar.scale, { duration: TIME_LIMIT, x: 0, ease: "none" });
    doll.start();

    setTimeout(() => {
        if (gameStat != "over"){
            text.innerHTML = "You run out of time!";
            gameStat = "over";
        }
    }, TIME_LIMIT * 1000);
}

init();

function animate() {
    renderer.render(scene, camera);
    if (gameStat == "over") return;
    requestAnimationFrame(animate);
    player.update();
}
animate();

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("keydown", (e) => {
    if (gameStat != "started") return;
    if (e.key === "ArrowUp") {
        player.run();
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") {
        player.stop();
    }
});
