# Simple 360 images viewer

App shows initial pack of images with ability to just drag-n-drop bunch of 360º files into browser window. 

Best possible image size is `4096x2048`.

[Demo](https://peterhofmuseum.ru/media/let/)

## Technical stuff

It's build on [Svelte](https://svelte.dev), basicaly just a wrapper around [three.js example](https://github.com/mrdoob/three.js/blob/master/examples/webgl_panorama_equirectangular.html)

Initial parameters are in `main.js`:
    `way` — array of strings — images to show
    `showInfo` — boolean — display info overlay

## Package scripts

Yes, `npm i` to install all dependencies

`npm run dev` for local development server ([localhost:5000](http://localhost:5000))

`npm run build` to compile minimized version (`public` folder)
