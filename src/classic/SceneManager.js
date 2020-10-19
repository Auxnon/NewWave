import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";


var emptyScene;
var scenes;
var animators = [];

var loadTest = false;


var data = [
    [ /* webpackChunkName: "App1SkyIsland" */ './App1SkyIsland', 'Sky Island'],
    [ /* webpackChunkName: "App2Punk" */ './App2Punk', 'Punk App']
]

function init() {
    emptyScene = new THREE.Scene();
    scenes = [];

    let cubeGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
    let cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff8833 }); //map: texture
    for(let i = 2; i < 5; i++) {
        scenes[i] = new THREE.Scene();
    }


    // import(/* webpackChunkName: "App1SkyIsland" */ './App1SkyIsland').then(module => {
    //     scenes[0]=module.init('Sky Island',Render,THREE);
    // }); 

    // import(/* webpackChunkName: "App2Punk" */ './App2Punk').then(module => {
    //     scenes[1]=module.init('Punk App',Render,THREE);
    // });
    //   }
    // })







    /*
      var geometry = new THREE.SphereGeometry( 5, 32, 32 );
      var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
      var sphere = new THREE.Mesh( geometry, material );

      sphere.position.set(0,0,-30);
      cubes.push(sphere);
      scenes[2].add(sphere);


      var geo = new THREE.OctahedronGeometry( 30, 1 );
      var mat = new THREE.MeshBasicMaterial( {color: 0xC92DD1} ); 
      var octa= new THREE.Mesh( geo, mat );
      octa.position.set(0,0,20);
      cubes.push(octa);
      scenes[3].add(octa);*/


}



function animate() {
    if(activeScene == 0) {

    } else if(activeScene == 1) {

    }
}

function flipScene(i) {
    activeScene = i;
}
var activeScene = 0;

function getScene() {
    let index = activeScene;
    let scene = scenes[index];
    if(scene == undefined) {
        scene = emptyScene
        scenes[index] = 'pend';

        import(data[index][0]).then(module => {
            scenes[index] = module.init(data[index][1], Render, THREE);
        })
    } else if(scene == 'pend') {
        scene = emptyScene;
    }
    return scene;
}

export { init, animate, flipScene, getScene }