import * as THREE from 'three';

			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
			import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
			import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

			let renderer, scene, camera, controls;

			init();

			async function init() {

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = true;
				renderer.outputEncoding = THREE.sRGBEncoding;
				document.body.appendChild( renderer.domElement );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.01, 10 );
				camera.position.set( 0.05,  0, 0 );

				controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 0.01, 0 );
				controls.minDistance = 0.02;
				controls.maxDistance = 5;
				controls.maxPolarAngle = Math.PI / 2;
				controls.autoRotate = true;
				//controls.addEventListener( 'change', render );
				controls.update();

				const rgbeLoader = new RGBELoader();
				const gltfLoader = new GLTFLoader();

				const [ texture, gltf ] = await Promise.all( [
					rgbeLoader.loadAsync( 'royal_esplanade_1k.hdr' ),
					gltfLoader.loadAsync( 'borneglb2.glb' ),
				] );

				// environment

				texture.mapping = THREE.EquirectangularReflectionMapping;

				scene.background = texture;
				scene.backgroundBlurriness = 0.5;
				scene.environment = texture;

				// model

				scene.add( gltf.scene );

				render();

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;

				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			function render() {
				requestAnimationFrame( render );
				controls.update();

				renderer.render( scene, camera );

			}