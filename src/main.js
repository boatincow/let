import App from './App.svelte';

var app = new App({
	target: document.body,
	props: {
		way: ["img/1.jpg"],
		showInfo: true
	}
});

export default app;