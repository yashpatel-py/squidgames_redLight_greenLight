const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor( 0xb7c3f3, 1 );

const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

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