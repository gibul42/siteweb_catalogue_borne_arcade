// Assurez-vous que vous avez inclus Three.js et le GLTFLoader dans votre fichier HTML
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('model-viewer').appendChild(renderer.domElement);

// Utilisez le GLTFLoader pour charger le fichier glTF
const loader = new THREE.GLTFLoader();
loader.load('borne v1 v6.gltf', function (gltf) {
    const model = gltf.scene;

    // Positionnez le mod�le 3D dans la sc�ne selon vos besoins
    model.position.set(0, 0, 0);

    scene.add(model);
});

camera.position.z = 5;

const animate = function () {
    requestAnimationFrame(animate);

    // Animation sp�cifique au mod�le 3D
    // Vous pouvez appliquer des rotations ou des transformations � l'objet ici

    renderer.render(scene, camera);
};

animate();
