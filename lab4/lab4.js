import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(8, 6, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide
    })
);
ground.rotation.x = -Math.PI / 2;

const grid = new THREE.GridHelper(20, 20);
scene.add(ground, grid);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 5);
scene.add(ambientLight, dirLight);

// Base
const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(base);

// Shoulder
const shoulder = new THREE.Group();
shoulder.position.y = 0.25;
base.add(shoulder);

const shoulderJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    baseMaterial
);
shoulder.add(shoulderJoint);

// Upper arm
const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3399ff });

const upperArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 3, 0.7),
    armMaterial
);
upperArm.position.y = 1.5;
shoulder.add(upperArm);

// Elbow
const elbow = new THREE.Group();
elbow.position.y = 3;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 32, 32),
    baseMaterial
);
elbow.add(elbowJoint);

// Forearm group
const forearmGroup = new THREE.Group();
elbow.add(forearmGroup);

const forearm = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 3, 0.7),
    armMaterial
);
forearm.position.y = 1.5;
forearmGroup.add(forearm);

// Wrist
const wrist = new THREE.Group();
wrist.position.y = 3;
forearmGroup.add(wrist);

const wristJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    baseMaterial
);
wrist.add(wristJoint);

// Palm
const palm = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.5, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xffaa55 })
);
palm.position.y = 0.8;
wrist.add(palm);

// Joint rotations
shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

// Keyboard controls
const rotationStep = THREE.MathUtils.degToRad(5);

window.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();

    if (key === 'q') {
        shoulder.rotation.z += rotationStep;
    }
    if (key === 'a') {
        shoulder.rotation.z -= rotationStep;
    }

    if (key === 'w') {
        elbow.rotation.z += rotationStep;
    }
    if (key === 's') {
        elbow.rotation.z -= rotationStep;
    }

    if (key === 'd') {
        wrist.rotation.z += rotationStep;
    }
    if (key === 'e') {
        wrist.rotation.z -= rotationStep;
    }
});

// Fingers
const fingers = [];

const fingerGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
const fingerMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa55 });

for (let i = 0; i < 5; i++) {
    const finger = new THREE.Mesh(fingerGeometry, fingerMaterial);

    if (i === 0) {
        // Thumb
        finger.position.set(-0.9, 0.3, 0);
        finger.rotation.z = THREE.MathUtils.degToRad(-40);
    } else {
        // Four fingers
        finger.position.set(-0.6 + (i - 1) * 0.4, 1.5, 0);
    }

    palm.add(finger);
    fingers.push(finger);
}

// Controls
const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    control.update();
    renderer.render(scene, camera);
}
animate();
