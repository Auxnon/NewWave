import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";

var cubes=[];
var greenModel;
var scenes;

var shapesTwo=[];

function init(){
  scenes=[];
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
          greenModel=m;
      greenModel.position.set(0,260,-40)
       greenModel.scale.set(10,10,10)
      scenes[0].add(greenModel);
    })
/*
    Render.loadModel('assets/tree.gltf',function(m){
       //m.scale.set(10,10,10)
       // m.position.set(0,160,-40)
       greenModel.add(m);
    })*/
    {
       var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
      scenes[0].add( ambientLight );
      var sunLight = new THREE.DirectionalLight( 0xffffff, 1 ); //DirectionalLight
      sunLight.position.set(0,1,0);
      sunLight.castShadow = true;
      scenes[0].add( sunLight );
      var sunTarget=new THREE.Object3D();
      sunTarget.position.set(-20,0,-20);
      scenes[0].add( sunTarget );
      sunLight.target=sunTarget;
    }

    {
      var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
      scenes[1].add( ambientLight );
      var sunLight = new THREE.DirectionalLight( 0xffffff, 0.6); //DirectionalLight
      sunLight.position.set(0,1,0);
      sunLight.castShadow = true;
      scenes[1].add( sunLight );
      var sunTarget=new THREE.Object3D();
      sunTarget.position.set(-20,0,-20);
      scenes[1].add( sunTarget );
      sunLight.target=sunTarget;
      window.sunTarget=sunTarget;
      window.sunLight=sunLight

      cubeGeometry = new THREE.BoxBufferGeometry( 20, 20, 40 );
      cubeMaterial = Render.specterMaterial;//new THREE.MeshBasicMaterial( { color:0xD53229 } )

      let cubeO=new THREE.Mesh(cubeGeometry,cubeMaterial);
      cubeO.position.set(-40,0,0);
      shapesTwo.push(cubeO)
      scenes[1].add(cubeO);
      Render.specterMaterial.color=0xD53229;
      var pyramid = new THREE.Mesh(new THREE.ConeGeometry( 20, 20, 4 ),new THREE.MeshStandardMaterial( { color:0xD53229 } ));
      pyramid.position.set(40,0,0);
      shapesTwo.push(pyramid)
      scenes[1].add(pyramid);
      window.pyr=pyramid


      barGraph([70.114, 69.14, 69.14, 68.653, 68.653, 69.14, 68.653, 69.627, 69.627, 68.653, 69.627, 69.14, 69.14, 68.653, 70.114, 69.14, 69.14, 69.14, 68.653, 69.14],scenes[1]);

        Render.loadModel('assets/skull.glb',function(m){
        m.position.set(0,0,0)
         m.scale.set(10,10,10)
        scenes[1].add(m);
        window.model=m;
      })

    }




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
  if(activeScene==0){
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
  }else if(activeScene==1){
    shapesTwo.forEach(c=>{
      c.rotation.x=Math.PI/2
      c.rotation.y+=0.02;
    })
  }
	

  
}
function flipScene(i){
  activeScene=i;
}
var activeScene=0;
function getScene(){
  return scenes[activeScene];
}

function barGraph(data,scene){
 /* let cubeO=new THREE.Mesh(cubeGeometry,cubeMaterial);
      cubeO.position.set(-40,0,0);
      shapesTwo.push(cubeO)
      scenes[1].add(cubeO);
      Render.specterMaterial.color=0xD53229;*/


      let factor=80/data.length
      let geo=new THREE.BoxBufferGeometry( factor/2, 10,15 )
      let s=0xFFD631;
      let e=0xD53229;
      


      for(let i=0;i<data.length;i++){
        let val=data[i]
        let scale=(72-val)/3
        let color=((e-s)*scale)+s
        console.log(scale)

        let cube = new THREE.Mesh(geo,new THREE.MeshStandardMaterial( { color:color } ));
        cube.position.set(-40+i*factor,0,10)
        cube.scale.set(1,1,scale)
        scene.add(cube)
      }
      


}



export {init,animate,flipScene,getScene}