<script>
	import * as THREE from 'three';
	import {onMount} from 'svelte';
	import TopProgress from './TopProgress.svelte';
	import Preloader from './Preloader.svelte';
	import Panorama from './Panorama.svelte';
	
	export let way = ["def.jpg"];

	let panoramaTexture; // todo: move threejs stuff into panorama

	let progress;
	let container;
	let loading = false;

	var camera, scene, renderer, material;

	let lonSpeed = 0.01;

	var isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 0, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0;

	onMount(()=>{
		preloadTextures([...way]);
		init();
		animate();

		return ()=>{
			// todo: unmount stuff
		};
	});

	function preloadTextures(list) {
		let total = list.length;
		
		(function load()
		{
			var textureLoader = new THREE.ImageLoader();
			textureLoader.load(list[0], () => {
				list.shift();
				progress.set( (1 - list.length / total) * 100 );
				if (list.length != 0)
					load();
			});
		})();
	}
	
	function init() {

		var mesh;

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
		camera.target = new THREE.Vector3( 0, 0, 0 );

		scene = new THREE.Scene();

		var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
		// invert the geometry on the x-axis so that all of the faces point inward
		geometry.scale( - 1, 1, 1 );

		loading = true;
		var texture = new THREE.TextureLoader().load( way[0], (texture) => {material.map = texture; lon = 0; loading = false;});
		material = new THREE.MeshBasicMaterial( { map: texture } );

		mesh = new THREE.Mesh( geometry, material );

		scene.add( mesh );

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function onPointerStart( event ) {

		isUserInteracting = true;

		var clientX = event.clientX || event.touches[ 0 ].clientX;
		var clientY = event.clientY || event.touches[ 0 ].clientY;

		onMouseDownMouseX = clientX;
		onMouseDownMouseY = clientY;

		onMouseDownLon = lon;
		onMouseDownLat = lat;

	}

	function onPointerMove( event ) {

		if ( isUserInteracting === true ) {

			var clientX = event.clientX || event.touches[ 0 ].clientX;
			var clientY = event.clientY || event.touches[ 0 ].clientY;

			lon = ( onMouseDownMouseX - clientX ) * 0.1 + onMouseDownLon;
			lat = ( clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;

		}

	}

	function onPointerUp() {

		isUserInteracting = false;

	}

	function onDocumentMouseWheel( event ) {

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

		lat = Math.max( - 85, Math.min( 85, lat ) );
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

	function onDragOver(event) {
		event.dataTransfer.dropEffect = 'copy';
	}

	function onDragEnter(event) {
		document.body.style.opacity = 0.5;
	}

	function onDragLeave(event) {
		document.body.style.opacity = 1;
	}

	function onDrop() {
			var reader = new FileReader();
			reader.addEventListener( 'load', function ( event ) {

				material.map.image.src = event.target.result;
				material.map.needsUpdate = true;

			}, false );
			reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

			document.body.style.opacity = 1;
	}

	function onKeyDown(event) {
		if (event.key == "s")
		{
			lonSpeed = lonSpeed == 0 ? 0.01 : 0;
		}
		else if (event.keyCode == 13)
		{
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen();
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen(); 
				}
			}
		}
		
		if (loading)
			return;
		
		if (event.key == "ArrowLeft" || event.key == "ArrowUp")
		{
			loading = true;
			way.unshift(way.pop());
			new THREE.TextureLoader().load( way[0], (texture) => {material.map = texture; lon = 0; loading = false;});
		}
		else if (event.key == "ArrowRight" || event.key == "ArrowDown" || event.key == " ")
		{
			loading = true;
			way.push(way.shift());
			new THREE.TextureLoader().load( way[0], (texture) => {material.map = texture; lon = 0; loading = false;});
		}
	}
</script>

<svelte:window on:resize={onWindowResize}
				on:dragover|preventDefault={onDragOver}
				on:dragenter={onDragEnter}
				on:dragleave={onDragLeave}
				on:drop|preventDefault={onDrop}/>

<svelte:body on:mousedown={onPointerStart} on:mousemove={onPointerMove} on:mouseup={onPointerUp}
			on:wheel={onDocumentMouseWheel}
			on:touchstart={onPointerStart} on:touchmove={onPointerMove} on:touchend={onPointerUp}
			on:keydown={onKeyDown}/>

<TopProgress bind:progress/>

{#if loading}
	<Preloader/>
{/if}

<div id="panorama" bind:this={container}></div>