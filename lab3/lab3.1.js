import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import { color } from 'three/src/nodes/tsl/TSLCore.js'; 
 
const scene = new THREE.Scene(); 
 
const camera = new THREE.PerspectiveCamera( 
    75, 
    innerWidth / innerHeight, 
    0.1, 
    100 
); 

camera.position.set(6, 5, 8); 
 
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize(innerWidth, innerHeight); 
document.body.appendChild(renderer.domElement); 
 
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6); 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15); 

scene.add(pointLight, ambientLight); 
 
//dielli 
const geometry = new THREE.SphereGeometry(2, 32, 24); 
const material = new THREE.MeshStandardMaterial({color: 0xff7700}); 
const dielli = new THREE.Mesh(geometry, material); 

scene.add(dielli); 

const orbitToke = new THREE.Object3D();
dielli.add(orbitToke);

//toka
const toka = new THREE.Mesh(
    new geometry = new THREE.SphereGeometry(0.8,32,24),
    new THREE.MeshStandardMaterial({color:0x1e40ff,roughness:0.6})
);

toka.position.x = 6;
orbitToke.add(toka);
 
const control = new OrbitControls(camera, renderer.domElement); 
 
function animate() { 
    requestAnimationFrame(animate); 
    control.update(); 
    orbitToke.rotation.y += 0.01
    renderer.render(scene, camera); 
} 

animate();