import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";

function init(n) {
	let scene= new THREE.Scene();

      var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
      scene.add( ambientLight );
      var sunLight = new THREE.DirectionalLight( 0xffffff, 0.6); //DirectionalLight
      sunLight.position.set(0,1,0);
      sunLight.castShadow = true;
      scene.add( sunLight );
      var sunTarget=new THREE.Object3D();
      sunTarget.position.set(-20,0,-20);
      scene.add( sunTarget );
      sunLight.target=sunTarget;


      Render.loadModel('assets/skull.glb',function(m){
        m.position.set(0,0,0)
         m.scale.set(10,10,10)
         m.rotation.y=-Math.PI/2 //pi2 to pi
        scene.add(m);
      })

	return scene
}

function animate(){

}

function deinit(){

}




export {init,animate,deinit}