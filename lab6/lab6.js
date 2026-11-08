
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const aspect = window.innerWidth / window.innerHeight;

const perspectiveCamera = new THREE.PerspectiveCamera(
    75,
    aspect,
    0.1,
    1000
);

perspectiveCamera.position.set(2, 2, 10);
perspectiveCamera.lookAt(0, 0, 0);
scene.add(perspectiveCamera);

const size = 8;

const orthographic = new THREE.OrthographicCamera(
    -size * aspect,
    size * aspect,
    size,
    -size,
    0.1,
    100
);

orthographic.position.set(0, 0, 10);
orthographic.lookAt(0, 0, 0);

const cameras = [perspectiveCamera, orthographic];
let current = 0;

console.log('Active : Perspective');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambient);

const dir = new THREE.DirectionalLight(0xffffff, 2.5);
dir.position.set(5, 8, 4);
scene.add(dir);

const depth = [0, -3, -7];
const colors = [0xFF0000, 0x00FF00, 0x0000FF];

const loader = new PLYLoader();

loader.load('models/3DObject.ply', (geo) => {
    geo.center();
    geo.computeVertexNormals();

    depth.forEach((z, i) => {
        const mesh = new THREE.Mesh(
            geo,
            new THREE.MeshStandardMaterial({
                color: colors[i],
                roughness: 0.5
            })
        );

        mesh.scale.setScalar(0.02);
        mesh.rotation.x = Math.PI;
        mesh.position.x = i * 2;
        mesh.position.z = z;

        scene.add(mesh);
    });
});

addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();

        current = current + 1;

        if (current >= cameras.length) {
            current = 0;
        }

        console.log('Active ', current === 0 ? 'Perspective' : 'Orthographic');
    }
});

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, cameras[current]);
}

animate();
