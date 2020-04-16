<script>
	import Tool from './Tool.svelte';
	import Info from './Info.svelte';

	let way = ["img/1.jpg", "img/2.jpg", "img/3.jpg", "img/4.jpg"];

	let preloader = document.getElementById("corePreloader");
	preloader.parentNode.removeChild(preloader);

	// todo: find which fix works for scroll bug in ios
	// src/utils/scroll-lock.js
	const body = document.querySelector('body');
	let scrollPosition = 0;

    body.style.removeProperty('overflow');
    body.style.removeProperty('position');
    body.style.removeProperty('top');
    body.style.removeProperty('width');
    window.scrollTo(0, scrollPosition);
</script>

<style>
	:global(html, body) {
		height: 100%;
		width: 100%;
		/* overflow: auto; */
		position: fixed;
	}
	:global(body) {
		margin: 0;
		padding: 0;
		overflow:hidden;
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
	}
</style>

<Tool {way}/>

<Info/>