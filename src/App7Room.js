import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";

//pass in name, and a pointer to a complete function which dictates everything has loaded, 
//we keep track inside the mini class by counting  resources and incrementing till count is complete then, complte()
//animate is called every render, deint... not used yet

//called at first run, plugs in all the goods
let group
function init(index, dom, complete) {
	let scene=new THREE.Scene();
	group=new THREE.Group();
	let geom = new THREE.BoxBufferGeometry( 10, 10, 6 );
    let mat=new THREE.MeshStandardMaterial( { color: 0xFFCD00,side: THREE.BackSide} );
    let room=new THREE.Mesh(geom,mat)
    group.add(room)

    let ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(ambientLight);
    let sunLight = new THREE.DirectionalLight(0xffffff, 0.6); //DirectionalLight
    sunLight.position.set(1, -2, 0);
    sunLight.castShadow = true;
    scene.add(ambientLight)
    scene.add(sunLight)

    scene.add(group)
    complete();
    return scene;

}

//runs every frame
function animate(delta) {
	group.rotation.z+=delta;
}

//unused for now, would deload everything for memory reasons
function deinit() {

}

//called when toggled to this app, on a page load with app ideally it would run init and immediately run open after
//also passes in the canvas in case the app wants to do something wacky with it like resize it or place it somewhere else
//return true if changes were made and it wont follow the default
function open(canvas) {

}
//called when app is closed out for another one
function close() {

}

export { init, animate, deinit, open, close }