
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 5, 9);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(4, 6, 5);
scene.add(sun);

scene.add(new THREE.GridHelper(20, 20));

const controls = new OrbitControls(camera, renderer.domElement);

const pickables = [];

const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.5, 32, 16),
    new THREE.ConeGeometry(0.5, 1, 32),
    new THREE.TorusGeometry(0.5, 0.15, 16, 100)
];

const colors = [0x00ffff, 0xff00ff, 0xffa500, 0x800080];

for (let i = 0; i < 4; i++) {

    const material = new THREE.MeshStandardMaterial({
        color: colors[i]
    });

    const mesh = new THREE.Mesh(geometries[i], material);

    mesh.name = 'Objekti' + (i + 1);
    mesh.position.set(-4 + i * 3, 0.5, 0);

    if (i === 3) {
        mesh.rotation.x = Math.PI / 2;
        mesh.position.y = 0.2;
    }

    scene.add(mesh);
    pickables.push(mesh);
}

// POINTER
const pointer = new THREE.Vector2();

function updatePointers(event) {
    const rect = renderer.domElement.getBoundingClientRect();

    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;

    const W = rect.width;
    const H = rect.height;

    pointer.x = (2 * px) / W - 1;
    pointer.y = 1 - (2 * py) / H;
}

// RAYCASTER
let selected = null;
let dragging = false;

const raycaster = new THREE.Raycaster();

renderer.domElement.addEventListener('pointerdown', (event) => {

    updatePointers(event);

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(pickables);

    if (selected) {
        selected.material.emissive.setHex(0x000000);
    }

    selected = hits.length > 0 ? hits[0].object : null;

    if (selected) {
        selected.material.emissive.setHex(0x882200);

        console.log('Selected:', selected.name);

        dragging = true;
        controls.enabled = false;
    } else {
        dragging = false;
        controls.enabled = true;
    }
});

// PLANE
const plane = new THREE.Plane(
    new THREE.Vector3(0, 1, 0),
    0
);

const intersect = new THREE.Vector3();

// POINTER MOVE
renderer.domElement.addEventListener('pointermove', (event) => {

    if (!dragging || !selected) {
        return;
    }

    updatePointers(event);

    raycaster.setFromCamera(pointer, camera);

    if (raycaster.ray.intersectPlane(plane, intersect)) {
        selected.position.x = intersect.x;
        selected.position.z = intersect.z;
    }
});

// POINTER UP
window.addEventListener('pointerup', () => {
    dragging = false;
    controls.enabled = true;
});



 
// GUI
const gui = new GUI();

for (let i = 0; i < pickables.length; i++) {

    const obj = pickables[i];

    const startPosition = obj.position.clone();

    const folder = gui.addFolder(obj.name);

    folder.add(obj.position, 'x').listen();
    folder.add(obj.position, 'y').listen();
    folder.add(obj.position, 'z').listen();

    const actions = {
        reset: function() {
            obj.position.copy(startPosition);
            folder.controllersRecursive().forEach(controller => {
                controller.updateDisplay();
            });

            if (selected === obj) {
                obj.material.emissive.setHex(0x000000);
                selected = null;
                dragging = false;
                controls.enabled = true;
            }
        }
    };

    folder.add(actions, 'reset').name('Rivendos Objektin');
}



// ANIMATION
function loop() {
    requestAnimationFrame(loop);

    controls.update();

    renderer.render(scene, camera);
}

loop();

// WINDOW RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});
