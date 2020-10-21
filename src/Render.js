import * as THREE from "./lib/three.module.js";
import * as Main from "./Main.js";
import { GLTFLoader } from "./lib/GLTFLoader.js";


import { EffectComposer } from './lib/EffectComposer.js';
import { ShaderPass } from './lib/ShaderPass.js';
import { LuminosityShader } from './lib/LuminosityShader.js';



//import * as Control from "./Control.js?v=16";
//import * as World from "./World.js?v=16";
//import {OrbitControls} from "./lib/OrbitControls.js";
//import * as Texture from "./Texture.js?v=16";
//import * as Stats from "./lib/stats.js";
//import * as AssetManager from "./AssetManager.js?v=16";
//import * as Experiment from "./Experiment.js?v=16";


var camera, renderer;

var docWidth, docHeight;

var loader;
var mixer;

var SHADOW_SIZE = 2048;
var SIZE_DIVIDER = 8;

var alphaCanvas;
var betaCanvas;


var activeCanvas;

var composer;

var specterMaterial;
var SCENE_IMPORT;


function init(data, initialScene) {
    if(initialScene)
        activeScene = initialScene;

    SCENE_IMPORT = data;
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 100; //400
    camera.position.y = -200; //-800
    camera.up = new THREE.Vector3(0, 0, 1)

    camera.lookAt(new THREE.Vector3(0, 100, 0));



    alphaCanvas = document.createElement('div');
    betaCanvas = document.createElement('div');
    alphaCanvas.classList.add('canvasHolder');
    betaCanvas.classList.add('canvasHolder');
    betaCanvas.style.background = '#fff5'
    alphaCanvas.reserved = false;
    betaCanvas.reserved = false;


    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setClearColor(0x000000, 0); //0xb0e9fd,1);//0xb0e9fd,1)

    alphaCanvas.appendChild(renderer.domElement);

    loader = new GLTFLoader();

    initCustomMaterial();

    sceneInit();
    activeCanvas = alphaCanvas;



    resize();


    composer = new EffectComposer(renderer);
    var luminosityPass = new ShaderPass(LuminosityShader);
    composer.addPass(luminosityPass);


    animate();


}

function getAlphaCanvas() {
    return alphaCanvas;
}

function getBetaCanvas() {
    return betaCanvas;
}

function loadModel(model, callback, texture, color) {
    loader.load(
        ('./' + model), //villager22.gltf',
        (gltf) => {
            // called when the resource is loaded
            //gltf.scene.scale.set(10,10,10);
            let model; //=gltf.scene.children[0];
            gltf.scene.rotation.x = Math.PI / 2;
            gltf.scene.traverse(function(child) {
                if(child instanceof THREE.Mesh) {
                    //if(child.name=="Cube"){
                    model = child;
                    if(!texture) {
                        if(color)
                            child.material = new THREE.MeshStandardMaterial({ color: color, metalness: 0, roughness: 1.0 }); // 
                        else
                            child.material = specterMaterial; //new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors, metalness: 0, roughness: 1.0}); // 

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
            let m2 = gltf.scene.children[0];
            if(model) {
                var animations = gltf.animations;
                if(animations && animations.length) {

                    mixer = new THREE.AnimationMixer(model);
                    for(var i = 0; i < animations.length; i++) {
                        var animation = animations[i];
                        // There's .3333 seconds junk at the tail of the Monster animation that
                        // keeps it from looping cleanly. Clip it at 3 seconds

                        //if ( sceneInfo.animationTime ) {
                        //    animation.duration = sceneInfo.animationTime;


                        // }
                        action = mixer.clipAction(animation);
                        //action.setEffectiveTimeScale(200);
                        //action.timeScale=0.002;
                        action.timeScale = 0.002;
                        //if ( state.playAnimation ) 
                        action.play();
                    }
                }
                //mainScene.add( gltf.scene.children[0] );
            }
            callback(gltf.scene);
        },
        (xhr) => {
            // called while loading is progressing
            console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
        },
        (error) => {
            // called when loading has errors
            console.error('An error happened', error);
        },
    );
}

function resize() {
    Math.max(window.screen.width, window.innerWidth)
    Math.max(window.screen.height, window.innerHeight)

    docWidth =  Math.max(window.screen.width, window.innerWidth)
    docHeight = Math.max(window.screen.height, window.innerHeight)//window.innerHeight;
    camera.aspect = docWidth / docHeight;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(0.5);//window.devicePixelRatio / SIZE_DIVIDER);
    renderer.setSize(docWidth, docHeight);
}

function animate(time) {
    sceneAnimate();
    renderer.render(getScene(), camera);
    //composer.render();
    requestAnimationFrame(animate);
}

function dumpImage(img) {
    let dom = document.querySelector('#afterImage');
    if(dom)
        dom.setAttribute('src', img);
}

function bufferPrint() {
    //_grabImage=true;
    renderer.render(getScene(), camera);
    dumpImage(renderer.domElement.toDataURL());
}

var anchors = [];

function addAnchor(host, bubble) {
    let anchor = {
        host: host,
        bubble: bubble,
        x: 0,
        y: 0,
        offset: 0,
    }
    anchors.forEach(a => {
        if(a.host == host) {
            a.offset -= 40;
        }
    })
    anchors.push(anchor);
    console.log(anchors.length + ' anchors');
    updateAnchor(anchor, anchors.length - 1);
    return anchor;
}

function updateAnchor(anchor, index) {
    if(!anchor.bubble) {
        anchors.splice(index, 1);
        return false;
    }
    if(anchor.host) {
        let vector = projectVector(anchor.host);
        anchor.bubble.style.left = -16 + vector.x + 'px';
        anchor.bubble.style.top = (40 + anchor.offset + vector.y) + 'px';
        anchor.x = vector.x;
        anchor.y = vector.y;
    }

}

function roundEdge(x) {
    x = x % (Math.PI)
    if(x < 0)
        x += Math.PI * 2;

    if(x > Math.PI / 4) {
        if(x > 5 * Math.PI / 4) {
            if(x < 7 * Math.PI / 4) {
                return Math.PI * 3 / 2;
            }
        } else {
            if(x > 3 * Math.PI / 4) {
                return Math.PI;
            } else {
                return Math.PI / 2;
            }
        }
    }
    return 0;
}

function syncModel(index, obj) {
    let m = modelsIndexed[index];
    m.position.x = obj.x;
    m.position.y = obj.y;
    m.position.z = obj.z;
}

function createModel(index) {
    let model = new THREE.Mesh(cubeGeometry, cubeMaterial);
    modelsIndexed[index] = model;
    return model;
}
/*
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
}*/
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = Math.random() > 0.5 ? 0x66B136 : 0x76610E;
    return parseInt(color);
}

function applyCursor() {
    if(Control.down()) {
        pointer.material = pointerMatOn;
    } else
        pointer.material = pointerMat;
    var vector = new THREE.Vector3();
    vector.set((Control.screenX() / window.innerWidth) * 2 - 1, -(Control.screenY() / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera)
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));

    pointer.position.x = pos.x;
    pointer.position.y = pos.y
    Control.setVector(pointer.position);

}

function projectVector(object) {

    var width = docWidth,
        height = docHeight;
    var widthHalf = width / 2,
        heightHalf = height / 2;

    let vector = object.position.clone();
    vector.z += 30
    //vector.applyMatrix4(object.matrixWorld);
    vector.project(camera)

    //var projector = new THREE.Projector();
    //projector.projectVector( vector.setFromMatrixPosition( object.matrixWorld ), camera );

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;
    return vector;

}


var specterMaterial

function initCustomMaterial() {

    var meshphysical_frag = `
    #define STANDARD
#ifdef PHYSICAL
    #define REFLECTIVITY
    #define CLEARCOAT
    #define TRANSPARENCY
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef TRANSPARENCY
    uniform float transparency;
#endif
#ifdef REFLECTIVITY
    uniform float reflectivity;
#endif
#ifdef CLEARCOAT
    uniform float clearcoat;
    uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
    uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
    varying vec3 vNormal;
    #ifdef USE_TANGENT
        varying vec3 vTangent;
        varying vec3 vBitangent;
    #endif
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>

#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
    #include <clipping_planes_fragment>
    vec4 diffuseColor = vec4( diffuse, opacity );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    vec3 totalEmissiveRadiance = emissive;
    #include <logdepthbuf_fragment>
    #include <map_fragment>
    #include <color_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <roughnessmap_fragment>
    #include <metalnessmap_fragment>
    #include <normal_fragment_begin>
    #include <normal_fragment_maps>
    #include <clearcoat_normal_fragment_begin>
    #include <clearcoat_normal_fragment_maps>
    #include <emissivemap_fragment>
    #include <lights_physical_fragment>
    #include <lights_fragment_begin>
    #include <lights_fragment_maps>
    #include <lights_fragment_end>
    #include <aomap_fragment>
    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
    #ifdef TRANSPARENCY
        diffuseColor.a *= saturate( 1. - transparency + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) );
    #endif
    gl_FragColor = vec4( outgoingLight,1.-(((0.2125 * outgoingLight.r) + (0.7154 * outgoingLight.g) + (0.0721 * outgoingLight.b)) ) );
    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>
    #include <premultiplied_alpha_fragment>
    #include <dithering_fragment>
}`

    //gl_FragColor = vec4( outgoingLight, diffuseColor.a );


    /*
    #ifdef USE_COLOR
                if(vColor==vec3(0,0,1))
                    diffuseColor.rgb *= vec3(1,0,0);
                else
                    diffuseColor.rgb *= vColor;
        #endif*/

    //    #include <color_vertex>

    var meshphysical_vert = `#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
    varying vec3 vNormal;
    #ifdef USE_TANGENT
        varying vec3 vTangent;
        varying vec3 vBitangent;
    #endif
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

uniform vec3 shirt;
uniform vec3 wind;

void main() {
    #include <uv_vertex>
    #include <uv2_vertex>
    #ifdef USE_COLOR
        if(color==vec3(0,0,1))
            vColor.xyz = shirt;
        else
            vColor.xyz = color.xyz;
        
    #endif
    #include <beginnormal_vertex>
    #include <morphnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>
#ifndef FLAT_SHADED
    vNormal = normalize( transformedNormal );
    #ifdef USE_TANGENT
        vTangent = normalize( transformedTangent );
        vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
    #endif
#endif
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    #include <displacementmap_vertex>

    
        if(color==vec3(1,0,0)){
            float val=max(0.0, 1.0976 - transformed.z);
            transformed.xyz+=val*wind;
            transformed.y*=1.0+sin((wind.z+transformed.z)*4.0)/2.0;

        }
    

    #include <project_vertex>
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    vViewPosition = - mvPosition.xyz;
    #include <worldpos_vertex>
    #include <shadowmap_vertex>
    #include <fog_vertex>
}`

    var uniforms = THREE.UniformsUtils.merge(
        [THREE.ShaderLib.standard.uniforms,
            //{shirt: {value:new THREE.Vector3(0,1,0)},
            //wind: {value:new THREE.Vector3(0,0,0)}}
        ]
    );

    /*specterMaterial =  new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
  })**/


    specterMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        derivatives: false,
        lights: true,
        vertexColors: true,
        vertexShader: meshphysical_vert,
        fragmentShader: meshphysical_frag,
        roughness: 0.0,
        metalness: 1.0,
        //vertexShader: THREE.ShaderChunk.cube_vert,
        //fragmentShader: THREE.ShaderChunk.cube_frag
    });

}
/////SCENE///////

var emptyScene;
var scenes;



function sceneInit() {
    emptyScene = new THREE.Scene();
    scenes = [];

    let cubeGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
    let cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff8833 }); //map: texture

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



function sceneAnimate() {
    if(activeModule) {
        activeModule.animate()
    }
}

function flipScene(i) {
    activeScene = i;
}
var activeScene = 0;
var activeModule;

function getScene() {
    let index = activeScene;
    let scene = scenes[index];
    if(scene == undefined) {
        scene = emptyScene
        scenes[index] = 'pend';

        //wow this is a conufsing mess but it's functional!
        let importerFunction = SCENE_IMPORT[index];
        if(importerFunction) {
            Main.pendApp(index)
            importerFunction(module => {
                scenes[index] = [module.init('start the feller', THREE), module]
                Main.clearPendApp(index)
            });
        } else {
            scenes[index] = [emptyScene, undefined]
        }

        /*import(SCENE_DATA[index][0]).then(module => {
            scenes[index] = module.init(SCENE_DATA[index][1], Render, THREE);
        })*/
    } else if(scene == 'pend') {
        scene = emptyScene;
    } else {
        activeModule = scene[1]; //define the module that's currently active so we can run it's animate function in sceneAnimate()
        scene = scene[0] //please forgive me, trust me it works
    }

    return scene;
}

///////////////






export { init, getAlphaCanvas, getBetaCanvas, bufferPrint, loadModel, flipScene, specterMaterial, resize }