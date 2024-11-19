import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xbababa);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(6, 9, 4);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
});

const spotLight = new THREE.SpotLight(0x7f7fff, 100, 100, 0.3, 1);
spotLight.position.set(10, 60, 5);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

let baseObject, buttonObject;
let skrup1;
let skrup2;
let skrup3;

const loader = new GLTFLoader().setPath("asset/");
loader.load(
  "JamTanganReal.glb",
  (gltf) => {
    const mesh = gltf.scene;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

      // Check for object names and assign them
      if (child.name === "Puterputer") baseObject = child;
      if (child.name === "Tombol") buttonObject = child;
      if (child.name === "Mekanik1") skrup1 = child;
      if (child.name === "Mekanik2") skrup2 = child;
      if (child.name === "Mekanik3") skrup3 = child;
    });

    mesh.position.set(0, 1.05, -1);
    scene.add(mesh);

    document.getElementById("progress-container").style.display = "none";
  },
  (xhr) => {
    document.getElementById("progress").innerHTML = `LOADING ${
      (xhr.loaded / xhr.total) * 100
    }/100`;
  }
);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Rotate omnitrix object
document.getElementById("rotate-y-button").addEventListener("click", () => {
  if (baseObject) {
    gsap.to(baseObject.rotation, {
      y: baseObject.rotation.y + (36 * Math.PI) / 180,
      duration: 0.5,
      ease: "power2.out",
    });
  }
});

// Animate the "Tombol" button press
document.getElementById("tombol-button").addEventListener("click", () => {
  if (buttonObject) {
    // Create a vector for the direction the button should move outward
    const direction = new THREE.Vector3(-Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2); // 45 degrees between -x and z
    direction.normalize();

    // Calculate the target position
    const originalPosition = buttonObject.position.clone();
    const targetPosition = originalPosition
      .clone()
      .sub(direction.multiplyScalar(0.1)); // Move outward first

    // Animate the button moving outward and then returning
    gsap.to(buttonObject.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  }
});

// Rotate skrup1
document.getElementById("skrup1-button").addEventListener("click", () => {
  if (skrup1) {
    // Create a vector for the direction the button should move outward
    const direction = new THREE.Vector3(Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2); // 45 degrees between -x and z
    direction.normalize();

    // Calculate the target position
    const originalPosition = skrup1.position.clone();
    const targetPosition = originalPosition
      .clone()
      .sub(direction.multiplyScalar(0.1)); // Move outward first

    // Animate the button moving outward and then returning
    gsap.to(skrup1.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  }
});

// Rotate skrup2
document.getElementById("skrup2-button").addEventListener("click", () => {
  if (skrup2) {
    gsap.to(skrup2.rotation, {
      x: skrup2.rotation.x + (36 * Math.PI) / 180, // Corrected reference
      duration: 0.5,
      ease: "power2.out",
    });
  }
});

// Rotate skrup3
document.getElementById("skrup3-button").addEventListener("click", () => {
  if (skrup3) {
    // Create a vector for the direction the button should move outward
    const direction = new THREE.Vector3(Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2); // 45 degrees between -x and z
    direction.normalize();

    // Calculate the target position
    const originalPosition = skrup3.position.clone();
    const targetPosition = originalPosition
      .clone()
      .sub(direction.multiplyScalar(0.1)); // Move outward first

    // Animate the button moving outward and then returning
    gsap.to(skrup3.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  }
});

document.getElementById("light-x").addEventListener("input", (e) => {
  spotLight.position.x = e.target.value;
});

document.getElementById("light-y").addEventListener("input", (e) => {
  spotLight.position.y = e.target.value;
});

document.getElementById("light-z").addEventListener("input", (e) => {
  spotLight.position.z = e.target.value;
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
