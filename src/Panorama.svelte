<script>
	import * as THREE from 'three';
	import {onMount, beforeUpdate} from 'svelte';

	export let panoramaTexture;

	let container;

	var camera, scene, renderer, material;

	let lonSpeed = 0.01;

	var isUserInteracting = false,
        onMouseDownMouseX = 0, onMouseDownMouseY = 0,
        lon = 0, onMouseDownLon = 0,
        lat = 0, onMouseDownLat = 0,
        phi = 0, theta = 0;

    let inited = false;
    
	onMount(()=>{
        init();
        
		return ()=>{
			console.log('Panorama warning: please implement unmount');
		};
	});

	beforeUpdate(()=>{
        
        if ( !inited ) {
            init();
        } else if ( panoramaTexture ) {
            material.map = panoramaTexture;
        	lon = 143;//magic number — suits best first panorama
        	lat = 0;
			phi = 0;
			theta = 0;
        }

	});
	
	function init() {

        if ( inited || !panoramaTexture )
            return;

		var mesh;

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
		camera.target = new THREE.Vector3( 0, 0, 0 );

		scene = new THREE.Scene();

		var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
		// invert the geometry on the x-axis so that all of the faces point inward
		geometry.scale( - 1, 1, 1 );

		material = new THREE.MeshBasicMaterial( { map: panoramaTexture } );

		mesh = new THREE.Mesh( geometry, material );

		scene.add( mesh );

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );

        animate();
        inited = true;
	}

	function onWindowResize() {
		if (!inited)
			return;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function onPointerStart( event ) {
		if (!inited)
			return;
			
		isUserInteracting = true;

		var clientX = event.clientX || event.touches[ 0 ].clientX;
		var clientY = event.clientY || event.touches[ 0 ].clientY;

		onMouseDownMouseX = clientX;
		onMouseDownMouseY = clientY;

		onMouseDownLon = lon;
		onMouseDownLat = lat;

	}

	function onPointerMove( event ) {
		if (!inited)
			return;

		if ( isUserInteracting === true ) {

			var clientX = event.clientX || event.touches[ 0 ].clientX;
			var clientY = event.clientY || event.touches[ 0 ].clientY;

			lon = ( onMouseDownMouseX - clientX ) * 0.1 + onMouseDownLon;
			lat = ( clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;

		}

	}

	function onPointerUp() {
		if (!inited)
			return;

		isUserInteracting = false;

	}

	function onDocumentMouseWheel( event ) {
		if (!inited)
			return;

		var fov = camera.fov + event.deltaY * 0.05;

		camera.fov = THREE.MathUtils.clamp( fov, 10, 75 );

		camera.updateProjectionMatrix();

	}

	function animate() {

		requestAnimationFrame( animate );
		update();

	}

	function update() {

		if ( isUserInteracting === false ) {

			lon += lonSpeed;

		}

		lat = Math.max( - 33, Math.min( 85, lat ) );
		phi = THREE.MathUtils.degToRad( 90 - lat );
		theta = THREE.MathUtils.degToRad( lon );

		camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
		camera.target.y = 500 * Math.cos( phi );
		camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

		camera.lookAt( camera.target );

		/* distortion
		camera.position.copy( camera.target ).negate();
		*/

		renderer.render( scene, camera );

	}

</script>

<svelte:window on:resize={onWindowResize}/>

<svelte:body on:mousedown={onPointerStart} on:mousemove={onPointerMove} on:mouseup={onPointerUp}
			on:wheel={onDocumentMouseWheel}
			on:touchstart={onPointerStart} on:touchmove={onPointerMove} on:touchend={onPointerUp}/>

<div id="panorama" bind:this={container}></div>