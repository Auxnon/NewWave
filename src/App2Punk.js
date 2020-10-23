import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";

var skull;
var aniFactor=0;
var dir=0.2;

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
        skull=m;
        m.position.set(0,100,0)
         m.scale.set(4,4,4)
         m.rotation.y=-Math.PI/2 //pi2 to pi

        scene.add(m);
      })

	return scene
}

function animate(){
  aniFactor+=dir;
  if(aniFactor>100){
    dir=-0.2
    aniFactor=100
  }else if(aniFactor<0){
    dir=0.2
    aniFactor=0
  }

  skull.rotation.y=Math.PI+(Math.PI*aniFactor/100.0)
   skull.rotation.z=(-Math.PI/8)*(50-Math.abs(aniFactor-50))/50
}

function deinit(){

}




export {init,animate,deinit}