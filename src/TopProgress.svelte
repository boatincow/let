<script>
	import { fade } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export const progress = tweened(0, {
		duration: 1000,
		easing: cubicOut
    });
    
</script>

<style>
	.bar {
		display: block;
        position: absolute;
        top:0;
        left: 0;
        height: 5px;
        background-color: white;
	}
</style>

{#if $progress != 100}
	<div transition:fade class="bar" style="width:{$progress}%"></div>
{/if}