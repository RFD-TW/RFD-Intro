import * as THREE from 'three';
import Stats from 'three/addons/stats.module.js';

let camera, scene, renderer, stats, materials;
let mouseX = 0, mouseY = 0;

let windowHalfX = $(document).width() / 2;
let windowHalfY = $(document).height() / 2;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 55, $(document).width() / $(document).height(), 2, 2000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.00075 );

	const geometries = [];
	const vertices = [], materials = [];

	const sprite = new THREE.TextureLoader().load( './three/sprites/dot64.png' );
	sprite.colorSpace = THREE.SRGBColorSpace;
	
	// 恆星配色 (HSL)
	const starColors = [
		[0, 1, 0.7], [0.042, 1, 0.7], [0.083, 1, 0.7], [0.125, 1, 0.7], [0.167, 1, 0.7], [0.5, 1, 0.7], [0.61, 1, 0.7],
		[0, 1, 0.8], [0.042, 1, 0.8], [0.083, 1, 0.8], [0.125, 1, 0.8], [0.167, 1, 0.8], [0.5, 1, 0.8], [0.61, 1, 0.8],
		[0, 1, 1]
	];
	
	// 每種顏色建立複數個位置，白色 (0,1,1) 則多建立一些
	starColors.forEach((color) => {
		
		let material = new THREE.PointsMaterial( { 
			size: 10,
			sizeAttenuation: true,
			map: sprite,
			alphaTest: 0.5,
			transparent: true
		} );
		material.color.setHSL( color[0], color[1], color[2], THREE.SRGBColorSpace );
		materials.push(material);
		
		let colorPos = [];
		for ( let i = 0; i < 50; i++ ) {
			const x = 2000 * Math.random() - 1000;
			const y = 2000 * Math.random() - 1000;
			const z = 2000 * Math.random() - 1000;
			colorPos.push( x, y, z );
		}
		if (color[2] == 1)
			for ( let i = 0; i < 250; i++ ) {
				const x = 2000 * Math.random() - 1000;
				const y = 2000 * Math.random() - 1000;
				const z = 2000 * Math.random() - 1000;
				colorPos.push( x, y, z );
			}
		vertices.push(colorPos);
		
		// 為每個顏色的位置建立幾何模型
		geometries.push(new THREE.BufferGeometry());
	});
	
	// 套用顏色、位置，置入場景
	for ( let i = 0; i < starColors.length; i++ )
	{				
		geometries[i].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices[i], 3 ) );
		const particles = new THREE.Points( geometries[i], materials[i] );
		scene.add( particles );
	};

	//

	renderer = new THREE.WebGLRenderer( { antialias: true, powerPreference: 'high-performance' } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( $(document).width(), $(document).height() );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	
	document.body.appendChild(renderer.domElement);

	//

	stats = new Stats();
	document.body.appendChild( stats.dom );

	//

	document.body.addEventListener( 'pointermove', onPointerMove );

	//

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	windowHalfX = $(document).width() / 2;
	windowHalfY = $(document).height() / 2;

	camera.aspect = $(document).width() / $(document).height();
	camera.updateProjectionMatrix();

	renderer.setSize( $(document).width(), $(document).height() );

}

function onPointerMove( event ) {

	if ( event.isPrimary === false ) return;

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	const time = Date.now() * 0.00005;

	camera.position.x += ( mouseX - camera.position.x ) * 0.1;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.1;

	camera.lookAt( scene.position );
	renderer.render( scene, camera );

}