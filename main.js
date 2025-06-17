import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { GUI } from 'three/addons/libs/lil-gui';

// Create scene with white background
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls with restrictions
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth damping effect

// Limit vertical rotation (in radians)
controls.minPolarAngle = 0; // Don't allow camera to go above the model
controls.maxPolarAngle = Math.PI / 2; // Don't allow camera to go below horizontal

// Limit zoom range
controls.minDistance = 2; // Minimum zoom distance
controls.maxDistance = 20; // Maximum zoom distance

// Optional: Enable smooth zoom
controls.enableZoom = true;
controls.zoomSpeed = 0.5; // Slower zoom for more control

// Enhanced lighting setup
// Ambient light for overall illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Main directional light (simulates sun)
const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(5, 10, 7);
mainLight.castShadow = true;
scene.add(mainLight);

// Fill light from the opposite side
const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-5, 8, -7);
scene.add(fillLight);

// Soft light from above
const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
topLight.position.set(0, 10, 0);
scene.add(topLight);

// Enable shadow mapping
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// GUI setup
const gui = new GUI();

// Lighting controls
const lightingFolder = gui.addFolder('Lighting');
const lightingParams = {
    ambientIntensity: ambientLight.intensity,
    mainIntensity: mainLight.intensity,
    fillIntensity: fillLight.intensity,
    topIntensity: topLight.intensity
};

lightingFolder.add(lightingParams, 'ambientIntensity', 0, 1).name('Ambient Light').onChange((value) => {
    ambientLight.intensity = value;
});
lightingFolder.add(lightingParams, 'mainIntensity', 0, 1).name('Main Light').onChange((value) => {
    mainLight.intensity = value;
});
lightingFolder.add(lightingParams, 'fillIntensity', 0, 1).name('Fill Light').onChange((value) => {
    fillLight.intensity = value;
});
lightingFolder.add(lightingParams, 'topIntensity', 0, 1).name('Top Light').onChange((value) => {
    topLight.intensity = value;
});

// Load the 3D model
const loader = new GLTFLoader();

loader.load(
    'assets/House_OKC.glb',
    function (gltf) {
        const object = gltf.scene;
        
        // Center the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);

        // Material controls
        const materials = new Set();
        object.traverse(function (child) {
            if (child.isMesh) {
                // Ensure the material has color property
                if (!child.material.color) {
                    child.material.color = new THREE.Color(0x808080);
                }
                // Enable shadows for each mesh
                child.castShadow = true;
                child.receiveShadow = true;
                materials.add(child.material);
            }
        });

        // Add a ground plane to receive shadows
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.9
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Create material controls for each unique material
        materials.forEach((material, index) => {
            const matFolder = gui.addFolder(`Material ${index + 1}`);
            const matParams = {
                color: material.color.getHex(),
                metalness: material.metalness !== undefined ? material.metalness : 0.2,
                roughness: material.roughness !== undefined ? material.roughness : 0.8,
                wireframe: material.wireframe || false
            };

            matFolder.addColor(matParams, 'color').onChange((value) => {
                material.color.setHex(value);
            });
            
            if (material.metalness !== undefined) {
                matFolder.add(matParams, 'metalness', 0, 1).onChange((value) => {
                    material.metalness = value;
                });
            }
            
            if (material.roughness !== undefined) {
                matFolder.add(matParams, 'roughness', 0, 1).onChange((value) => {
                    material.roughness = value;
                });
            }
            
            matFolder.add(matParams, 'wireframe').onChange((value) => {
                material.wireframe = value;
            });
        });

        // Model controls
        const modelFolder = gui.addFolder('Model');
        const modelParams = {
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0
        };

        modelFolder.add(modelParams, 'scale', 0.1, 2).onChange((value) => {
            object.scale.set(value, value, value);
        });
        modelFolder.add(modelParams, 'rotationX', 0, Math.PI * 2).onChange((value) => {
            object.rotation.x = value;
        });
        modelFolder.add(modelParams, 'rotationY', 0, Math.PI * 2).onChange((value) => {
            object.rotation.y = value;
        });
        modelFolder.add(modelParams, 'rotationZ', 0, Math.PI * 2).onChange((value) => {
            object.rotation.z = value;
        });

        scene.add(object);

        // Adjust camera position based on model size
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.z = maxDim * 2;
        controls.update();
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error occurred loading the model:', error);
    }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    // Update controls
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
