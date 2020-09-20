import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";

let cubes=[];
let greenModel

function init(scenes){
	for(let i=0;i<5;i++){
        scenes[i]= new THREE.Scene();
    }

    let cubeGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
   	let cubeMaterial = new THREE.MeshStandardMaterial( { color:0xff8833 } ); //map: texture

   /*	let cube=new THREE.Mesh(cubeGeometry,cubeMaterial);

   	cube.position.set(10,10,10);


   	cubes.push(cube)
    scenes[0].add(cube);*/

    Render.loadModel('assets/island.glb',function(m){
      m.scale.set(10,10,10)
      m.position.set(0,260,-40)
      scenes[0].add(m);
      greenModel=m
      window.model=m;
    })

    var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
    scenes[0].add( ambientLight );
    var sunLight = new THREE.DirectionalLight( 0xffffff, 2 ); //DirectionalLight
    sunLight.position.set(0,1,0);
    sunLight.castShadow = true;
    scenes[0].add( sunLight );
    var sunTarget=new THREE.Object3D();
    sunTarget.position.set(-20,0,-20);
    scenes[0].add( sunTarget );
    sunLight.target=sunTarget;
    window.sunTarget=sunTarget;
    window.sunLight=sunLight

   /* let cube2=cube.clone();
    cube2.position.set(-20,-20,0);
    cubes.push(cube2)
    scenes[0].add(cube2);

    let cube3=cube.clone();
    cube3.position.set(-40,20,0);
    cubes.push(cube3)
    scenes[0].add(cube3);*/



    cubeGeometry = new THREE.BoxBufferGeometry( 20, 20, 40 );
   	cubeMaterial = new THREE.MeshBasicMaterial( { color:0xD53229 } ); //map: texture

   	let cubeO=new THREE.Mesh(cubeGeometry,cubeMaterial);
   	cubeO.position.set(-40,0,0);
   	cubes.push(cubeO)
   	scenes[1].add(cubeO);



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
	scenes[3].add(octa);

}

var value=0;
var dir=1;

function animate(){
	cubes.forEach(c=>{
		c.rotation.z+=0.1;
	})

  if(greenModel){
    value+=0.0005*dir
    if(value>1 || value<0){
      dir=-dir
    }
    greenModel.rotation.y=5.4+value*0.6//5.2 - 6
    //m.position.set(0,260,-40)
    greenModel.position.set(30-30*value,-80 +340*value,20 -60*value)
   // x: 30, y: -80, z: 20
    //console.log(greenModel.rotation.y)
  }
}
function flipScene(i){

}

export {init,animate,flipScene}