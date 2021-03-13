// import * as THREE from "./lib/three.module.js";
// import * as Render from "./Render.js";


// var emptyScene;
// var scenes;

// var data = [
//     [ /* webpackChunkName: "App1SkyIsland" */ './App1SkyIsland', 'Sky Island'],
//     [ /* webpackChunkName: "App2Punk" */ './App2Punk', 'Punk App']
// ]

// function init() {
//     emptyScene = new THREE.Scene();
//     scenes = [];

//     let cubeGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
//     let cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff8833 }); //map: texture
//     for (let i = 2; i < 5; i++) {
//         scenes[i] = new THREE.Scene();
//     }
// }



// function animate() {
//     if (activeScene == 0) {

//     } else if (activeScene == 1) {

//     }
// }

// function flipScene(i) {
//     activeScene = i;
// }
// var activeScene = 0;

// function getScene() {
//     let index = activeScene;
//     let scene = scenes[index];
//     if (scene == undefined) {
//         scene = emptyScene
//         scenes[index] = 'pend';

//         import(data[index][0]).then(module => {
//             scenes[index] = module.init(data[index][1], Render, THREE);
//         })
//     } else if (scene == 'pend') {
//         scene = emptyScene;
//     }
//     return scene;
// }

// export { init, animate, flipScene, getScene }