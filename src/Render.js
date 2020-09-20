
import * as THREE from "./lib/three.module.js";
import {GLTFLoader} from "./lib/GLTFLoader.js";

import * as SceneManager from "./SceneManager.js";
//import * as Control from "./Control.js?v=16";
//import * as World from "./World.js?v=16";
//import {OrbitControls} from "./lib/OrbitControls.js";
//import * as Texture from "./Texture.js?v=16";
//import * as Stats from "./lib/stats.js";
//import * as AssetManager from "./AssetManager.js?v=16";
//import * as Experiment from "./Experiment.js?v=16";


var camera, renderer;
var scenes=[];

var docWidth,docHeight;

var loader;
var mixer;

var SHADOW_SIZE=2048;
var SIZE_DIVIDER=2;

var alphaCanvas;
var betaCanvas;

var activeScene;
var activeCanvas;



function init(){
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.z = 100; //400
    camera.position.y = -200; //-800
    camera.up=new THREE.Vector3(0,0,1)

    camera.lookAt(new THREE.Vector3( 0, 100, 0 ));

    

    alphaCanvas=document.createElement('div');
    betaCanvas=document.createElement('div');
    alphaCanvas.classList.add('canvasHolder');
    betaCanvas.classList.add('canvasHolder');
    betaCanvas.style.background='#fff5'
    alphaCanvas.reserved=false;
    betaCanvas.reserved=false;


    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setClearColor(0x000000, 0);//0xb0e9fd,1);//0xb0e9fd,1)

    alphaCanvas.appendChild( renderer.domElement );

    loader = new GLTFLoader();

    SceneManager.init(scenes);
    activeCanvas=alphaCanvas;
    activeScene=scenes[0];


    window.addEventListener('resize',resizer);
    resizer();



    

    animate();
    window.camera=camera;
}
function getAlphaCanvas(){
    return alphaCanvas;
}
function getBetaCanvas(){
    return betaCanvas;
}
function flipScene(i,c){
    activeScene=scenes[i];
}
function loadModel(model,callback,texture,color){
    loader.load(
        ('./'+model),//villager22.gltf',
        ( gltf ) => {
            // called when the resource is loaded
            //gltf.scene.scale.set(10,10,10);
            let model;//=gltf.scene.children[0];
            gltf.scene.rotation.x=Math.PI/2;
            gltf.scene.traverse( function ( child ) {
                if (child instanceof THREE.Mesh) {
                    //if(child.name=="Cube"){
                        model=child;
                        //create a global var to reference later when changing textures
                        //apply texture
                        

                        //
                        

                        if(!texture){
                            if(color)
                                child.material = new THREE.MeshStandardMaterial({ color: color, metalness: 0, roughness: 1.0}); // 
                            else
                                child.material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors, metalness: 0, roughness: 1.0}); // 
                          
                            child.material.needsUpdate = true;
                            //child.material.skinning=true;
                        }
                        //child.material.morphTargets=true;

                        //child.material.map.needsUpdate = true;
                   // }else{

                    //}
                }
            });
            //gltf.scene.children[0].children[1].scale.set(20,20,20);

            //gltf.scene.children.pop();
           

            //let mixer = new THREE.AnimationMixer( gltf.scene );
             //model=gltf.scene.children[0]
             let m2=gltf.scene.children[0];
             if(model){
                var animations = gltf.animations;
                if ( animations && animations.length ) {

                    mixer = new THREE.AnimationMixer(model);
                    for ( var i = 0; i < animations.length; i ++ ) {
                        var animation = animations[ i ];
                        // There's .3333 seconds junk at the tail of the Monster animation that
                        // keeps it from looping cleanly. Clip it at 3 seconds

                        //if ( sceneInfo.animationTime ) {
                        //    animation.duration = sceneInfo.animationTime;


                       // }
                        action = mixer.clipAction( animation );
                        //action.setEffectiveTimeScale(200);
                        //action.timeScale=0.002;
                        action.timeScale=0.002;
                        //if ( state.playAnimation ) 
                            action.play();
                    }
                }
                 //mainScene.add( gltf.scene.children[0] );
             }
            callback(gltf.scene);
        },
        ( xhr ) => {
            // called while loading is progressing
            console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
        },
        ( error ) => {
            // called when loading has errors
            console.error( 'An error happened', error );
        },
    );
}
/*var toggle=false;
function animationControl(ev){
    if(action){
        if(toggle){
            action.reset().play();
        }else{
            action.halt(1000);
        }
        toggle=!toggle;
    }
}
*/

function resizer(){
    docWidth=Math.floor(window.innerWidth*0.76);
    docHeight=window.innerHeight;
    camera.aspect=docWidth/docHeight;
    camera.updateProjectionMatrix();
    
    renderer.setPixelRatio( window.devicePixelRatio/SIZE_DIVIDER);
    renderer.setSize( docWidth, docHeight);
}



function animate(time) {
    //let delta=time-prevTime;

    //if(mixer)mixer.update(delta);
    SceneManager.animate();
    renderer.render( activeScene, camera );
    //prevTime=time;
    //applyCursor();
    //if(_grabImage == true){
       // dumpImage(renderer.domElement.toDataURL());
        //_grabImage = false;
   // }
 
    requestAnimationFrame( animate );
}
function dumpImage(img){
    let dom=document.querySelector('#afterImage');
    if(dom)
        dom.setAttribute('src',img);
}
function bufferPrint(){
    //_grabImage=true;
    renderer.render( activeScene, camera );
    dumpImage(renderer.domElement.toDataURL());
}

var anchors=[];
function addAnchor(host,bubble){
    let anchor={
        host:host,
        bubble:bubble,
        x:0,
        y:0,
        offset:0,
    }
    anchors.forEach(a=>{
        if(a.host==host){
            a.offset-=40;
        }
    })
    anchors.push(anchor);
    console.log(anchors.length+' anchors');
    updateAnchor(anchor,anchors.length-1);
    return anchor;
}
function updateAnchor(anchor,index){
    if(!anchor.bubble){
        anchors.splice(index,1);
        return false;
    }
    if(anchor.host){
        let vector=projectVector(anchor.host);
        anchor.bubble.style.left=-16+vector.x+'px';
        anchor.bubble.style.top=(40+anchor.offset+vector.y)+'px';
        anchor.x=vector.x;
        anchor.y=vector.y;
    }
    
}
function roundEdge(x){
    x=x%(Math.PI)
    if(x<0)
        x+=Math.PI*2;
    
    if(x>Math.PI/4){
        if(x>5*Math.PI/4){
            if(x<7*Math.PI/4){
                return Math.PI*3/2;
            }
        }else{
            if(x>3*Math.PI/4){
                return Math.PI;
            }else{
                return Math.PI/2;
            }
        }
    }
    return 0;
}


function preModel(){
	/*cubeGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
   	cubeMaterial = new THREE.MeshBasicMaterial( { color:0xff8833 } ); //map: texture
    circleGeometry=new THREE.CircleGeometry( 5, 8 );
    let pointerGeom = new THREE.CircleGeometry( 6, 16 );
    pointerMat = new THREE.MeshBasicMaterial( { color:0x4AE13A } );
    pointerMatOn = new THREE.MeshBasicMaterial( { color:0xEBEE00 } );
    pointer = new THREE.Mesh(pointerGeom,pointerMat);
    pointer.position.z=1;
    mainScene.add(pointer);


    var length = 12, width = 8;

var shape = new THREE.Shape();

let cir=200;
shape.moveTo( 0,-cir );


for(let i=0;i<45;i++){
    let r=Math.PI*i/18.0;
    let x=Math.cos(r)*cir;
    let y=Math.sin(r)*cir;
    x*=(1+Math.random()/2.0);
    y*=(1+Math.random()/2.0);
    shape.lineTo(x,y)
}

var extrudeSettings = {
    steps: 2,
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 8,
    bevelOffset: 2,
    bevelSegments: 1
};

var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
var material = new THREE.MeshStandardMaterial( { color: 0xA1D100,roughness: 1.0,metalness: 0.0 } );
var mesh = new THREE.Mesh( geometry, material ) ;

mesh.position.z-=18;

mesh.receiveShadow=true;
currentScene.add( mesh );


ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
currentScene.add( ambientLight );

//var directionalLight = new THREE.PointLight( 0xffffff, 1,100 );
sunLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); //DirectionalLight
sunLight.position.set(0,160,200);
sunLight.castShadow = true;
currentScene.add( sunLight );

sunLight.shadow.mapSize.width = SHADOW_SIZE;  // default
sunLight.shadow.mapSize.height = SHADOW_SIZE; // default
sunLight.shadow.camera.near = 10;    // default
sunLight.shadow.camera.far = 500;     // default
const d1 = 300;

sunLight.shadow.camera.left = - d1;
sunLight.shadow.camera.right = d1;
sunLight.shadow.camera.top = d1;
sunLight.shadow.camera.bottom = - d1;

sunLight.shadow.radius = 2.2;

sunLight2=sunLight.clone();
sunLight2.shadow.mapSize.width = 256;  // default
sunLight2.shadow.mapSize.height = 256; // default
sunLight2.shadow.radius = 0;
sunLight2.visible=false;
currentScene.add(sunLight2);

var helper = new THREE.CameraHelper( sunLight.shadow.camera );
currentScene.add( helper );
*/

}

function syncModel(index,obj){
	let m=modelsIndexed[index];
	m.position.x=obj.x;
	m.position.y=obj.y;
	m.position.z=obj.z;
}
function createModel(index){
	let model = new THREE.Mesh( cubeGeometry, cubeMaterial );
	modelsIndexed[index]=model;
	return model;
}
function cubit(w,h,d,x,y,z,color,layer){
	let geom = new THREE.BoxBufferGeometry( w, h, d );
    let mat;
    if(color)
        mat=new THREE.MeshStandardMaterial( { color: parseInt(color)} );
    
	let model = new THREE.Mesh( geom,mat);
	model.position.x=x;
	model.position.y=y;
	model.position.z=z;
    model.castShadow=true;
    model.receiveShadow=true;
    if(layer!=undefined && scenes[layer]){
        scenes[layer].add(model);
    }else
	   scenes[0].add(model);
    return model;
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = Math.random()>0.5?0x66B136:0x76610E;
  return parseInt(color);
}

function applyCursor(){
	if(Control.down()){
        pointer.material=pointerMatOn;
    }else
        pointer.material=pointerMat;
		var vector = new THREE.Vector3();     
	    vector.set(( Control.screenX() / window.innerWidth ) * 2 - 1, - ( Control.screenY() / window.innerHeight ) * 2 + 1,0.5 );
	    vector.unproject(camera)
	    var dir = vector.sub( camera.position ).normalize();
	    var distance = - camera.position.z / dir.z;
	    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
	    
	    pointer.position.x =pos.x;
	    pointer.position.y =pos.y
	    Control.setVector(pointer.position);
	
}
function projectVector(object){

    var width = docWidth, height = docHeight;
    var widthHalf = width / 2, heightHalf = height / 2;

    let vector=object.position.clone();
    vector.z+=30
    //vector.applyMatrix4(object.matrixWorld);
    vector.project(camera)

    //var projector = new THREE.Projector();
    //projector.projectVector( vector.setFromMatrixPosition( object.matrixWorld ), camera );

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;
    return vector;

}


export {init,getAlphaCanvas,getBetaCanvas,flipScene,bufferPrint,loadModel}
