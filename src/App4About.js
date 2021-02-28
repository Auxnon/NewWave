import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";

//pass in name, and a pointer to a complete function which dictates everything has loaded, 
//we keep track inside the mini class by counting  resources and incrementing till count is complete then, complte()
//animate is called every render, deint... not used yet

let portrait;
function init(index,dom,complete) {
	let scene=new THREE.Scene();
	var ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(ambientLight);
    var sunLight = new THREE.DirectionalLight(0xffffff, 0.6); //DirectionalLight
    sunLight.position.set(-1, -1, -1);
    scene.add(sunLight);
	Render.loadModel('assets/portrait.glb', function(m) {
        portrait = m;
        m.position.set(0, 0, 0)
        m.scale.set(20, 20, 20)
        //m.rotation.y = -Math.PI / 2 //pi2 to pi
        scene.add(m);
        complete();
    })
    return scene;
}

function animate(delta){

}

function deinit(){

}

export {init,animate,deinit}