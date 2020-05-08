<script>
	import * as THREE from 'three';
	import {onMount} from 'svelte';
	import TopProgress from './TopProgress.svelte';
	import Panorama from './Panorama.svelte';

	// initial pack of images
	export let way = ["img/1.jpg"]; // def image by tomazolivier https://pixabay.com/photos/landscape-mounts-360°-snow-3531355/

	let panoramaTexture; // loading textures for initial pack
	let panoramaImgSrc; // loading img data for drag-n-drop pack
	let lonSpeed = 0.01; // rotation speed

	let progress;
	let loading = false;

	let textures = [];
	let imagesDrop;

	onMount(()=>{
		preloadTextures([...way]);

		return ()=>{
			console.log("Tool warning: please implement unmount");
		};
	});

	// loading initial images pack
	function preloadTextures(list) {
		let total = list.length;
		
		(function load() {
			loading = true;
			var textureLoader = new THREE.TextureLoader();
			textureLoader.load(list[0], (texture) => {
				if ( imagesDrop ) // stop loading if there was drag-n-drop
					return;
					
				textures.push(texture);
				if (textures.length == 1)
					panoramaTexture = texture;

				list.shift();
				progress.set( (1 - list.length / total) * 100 );
				if (list.length != 0)
					load();
				else
					loading = false;
			});
		})();
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

	// loading drag-n-drop data
	function onDrop(event) {
		let list = event.dataTransfer.files
		let total = list.length;
		imagesDrop = [];

		(function load() {
			loading = true;
			let reader = new FileReader();
			reader.addEventListener( 'load', function ( event ) {

				imagesDrop.push( event.target.result );
				if (imagesDrop.length == 1) // set first image to panorama
					panoramaImgSrc = event.target.result;
				
				progress.set( (imagesDrop.length / total) * 100 );
				if (imagesDrop.length != list.length)
					load();
				else
					loading = false;

			}, false );
			
			reader.readAsDataURL( list[ imagesDrop.length ] );
		})();

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
				let doc = document.documentElement;
				doc.req = doc.requestFullscreen || doc.webkitRequestFullScreen || doc.mozRequestFullScreen || doc.msRequestFullscreen;
				doc.req();
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
			if ( imagesDrop ) {
				imagesDrop.unshift(imagesDrop.pop());
				panoramaImgSrc = imagesDrop[0];
			} else {
				textures.unshift(textures.pop());
				panoramaTexture = textures[0];
			}
		}
		else if (event.key == "ArrowRight" || event.key == "ArrowDown" || event.key == " ")
		{
			if ( imagesDrop ) {
				imagesDrop.push(imagesDrop.shift());
				panoramaImgSrc = imagesDrop[0];
			} else {
				textures.push(textures.shift());
				panoramaTexture = textures[0];
			}
		}
	}
</script>

<svelte:window on:dragover|preventDefault={onDragOver}
				on:dragenter={onDragEnter}
				on:dragleave={onDragLeave}
				on:drop|preventDefault={onDrop}/>
<svelte:body on:keydown={onKeyDown}/>

<Panorama {panoramaTexture} {panoramaImgSrc}/>
<TopProgress bind:progress/>