<script>
	import Tool from './Tool.svelte';
	import Info from './Info.svelte';
	import { WEBGL } from './WebGL.js';

	export let way = ["img/1.jpg"];
	export let showInfo = true;

	let preloader = document.getElementById("corePreloader");
	preloader.parentNode.removeChild(preloader);

	let glAvailable = WEBGL.isWebGLAvailable();
	let glError = !glAvailable ? WEBGL.getErrorMessage(1).outerHTML : "";

</script>

<style>
	:global(html, body) {
		height: 100%;
		width: 100%;
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

{#if glAvailable}
	<Tool {way}/>
	{#if showInfo}
		<Info/>
	{/if}
{:else}
	{@html glError}
{/if}