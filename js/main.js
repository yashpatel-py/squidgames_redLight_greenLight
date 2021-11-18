const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor( 0xb7c3f3, 1 );

const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

// creating global variablesc
const start_position = 3
const end_position = -start_position

function createCube(size, positionX, rotY = 0, color = 0xfbc851){
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = positionX;
    cube.rotation.y = rotY;
    scene.add( cube );
    return cube;
}

camera.position.z = 5;

// Instantiate a loader
const loader = new THREE.GLTFLoader();

// creating doll class
class Doll{
    constructor(){
        loader.load(
            '../models/scene.gltf',
            (gltf) => {
                scene.add( gltf.scene );
                gltf.scene.scale.set(0.4, 0.4, 0.4);
                gltf.scene.position.set(0, -1, 0);
                this.doll = gltf.scene;
            },
        );
    }

    lookBackword(){
        // this.doll.rotation.y = -3.15;
        gsap.to(this.doll.rotation, {duration: .50, y: -3.15});
    }

    lookForward(){
        // this.doll.rotation.y = 0;
        gsap.to(this.doll.rotation, {duration: .50, y: 0});
    }
}

function createTrack(){
    createCube({w: start_position * 2 + .1, h: 1.5, d: 1}, 0, 0, 0xe5a716).position.z = -1;
    createCube({w: .2, h: 1.5, d: 1}, start_position, -.35);
    createCube({w: .2, h: 1.5, d: 1}, end_position,  .35);
}
createTrack();

let doll = new Doll();
setTimeout(() => {
    doll.lookBackword();
}, 1000);

function animate() {
    renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
animate();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}