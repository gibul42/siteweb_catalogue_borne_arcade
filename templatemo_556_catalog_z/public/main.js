import * as THREE from 'three';

			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
			import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
			import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

			let renderer, scene, camera, controls;

			init();

			async function init() {

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth*0.75, window.innerHeight );
				renderer.shadowMap.enabled = true;
				renderer.outputEncoding = THREE.sRGBEncoding;
				document.getElementById('model-viewer').appendChild(renderer.domElement);

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.01, 10 );
				camera.position.set( 0.05,  0, 0 );

				controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 0.01, 0 );
				// controls.minDistance = 0.02;
				// controls.maxDistance = 5;
				// controls.maxPolarAngle = Math.PI / 2;
				controls.enabled = false;
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

				renderer.setSize( renderer.domElement.clientWidth, window.innerHeight );

				render();

			}

			function resizeCanvasToDisplaySize() {
				const canvas = renderer.domElement;
				// look up the size the canvas is being displayed
				const width = canvas.clientWidth;
				const height = canvas.clientHeight;

			  
				// adjust displayBuffer size to match
				  // you must pass false here or three.js sadly fights the browser
				  renderer.setSize(width, height, false);
				  camera.aspect = width / height;
				  camera.updateProjectionMatrix();
				  // Convert camera fov degrees to radians



			  
				  // update any render target sizes here
			  }

			  function fitCameraToObject( camera, object, offset ) {

				offset = offset || 1.5;
				
				const boundingBox = new THREE.Box3();
				
				boundingBox.setFromObject( object );
				
				const center = boundingBox.getCenter( new THREE.Vector3() );
				const size = boundingBox.getSize( new THREE.Vector3() );
				
				const startDistance = center.distanceTo(camera.position);
				// here we must check if the screen is horizontal or vertical, because camera.fov is
				// based on the vertical direction.
				const endDistance = camera.aspect > 1 ?
									((size.y/2)+offset) / Math.abs(Math.tan(camera.fov/2)) :
									((size.y/2)+offset) / Math.abs(Math.tan(camera.fov/2)) / camera.aspect ;
				
				
				camera.position.set(
					camera.position.x * endDistance / startDistance,
					camera.position.y * endDistance / startDistance,
					camera.position.z * endDistance / startDistance,
					);
				camera.lookAt(center);
				}
			function render() {
				const gltfLoader = new GLTFLoader();
				requestAnimationFrame( render );
				controls.update();
				resizeCanvasToDisplaySize();
				fitCameraToObject(camera, scene,0.08)
				renderer.render( scene, camera );

			}