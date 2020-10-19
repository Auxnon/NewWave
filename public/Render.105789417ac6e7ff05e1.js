(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["Render"],{

/***/ "./src/Render.js":
/*!***********************!*\
  !*** ./src/Render.js ***!
  \***********************/
/*! exports provided: init, getAlphaCanvas, getBetaCanvas, bufferPrint, loadModel, flipScene, specterMaterial */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAlphaCanvas\", function() { return getAlphaCanvas; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getBetaCanvas\", function() { return getBetaCanvas; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"bufferPrint\", function() { return bufferPrint; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loadModel\", function() { return loadModel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"flipScene\", function() { return flipScene; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"specterMaterial\", function() { return specterMaterial; });\n/* harmony import */ var _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/three.module.js */ \"./src/lib/three.module.js\");\n/* harmony import */ var _Main_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Main.js */ \"./src/Main.js\");\n/* harmony import */ var _lib_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/GLTFLoader.js */ \"./src/lib/GLTFLoader.js\");\n/* harmony import */ var _lib_EffectComposer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/EffectComposer.js */ \"./src/lib/EffectComposer.js\");\n/* harmony import */ var _lib_ShaderPass_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/ShaderPass.js */ \"./src/lib/ShaderPass.js\");\n/* harmony import */ var _lib_LuminosityShader_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/LuminosityShader.js */ \"./src/lib/LuminosityShader.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n//import * as Control from \"./Control.js?v=16\";\n//import * as World from \"./World.js?v=16\";\n//import {OrbitControls} from \"./lib/OrbitControls.js\";\n//import * as Texture from \"./Texture.js?v=16\";\n//import * as Stats from \"./lib/stats.js\";\n//import * as AssetManager from \"./AssetManager.js?v=16\";\n//import * as Experiment from \"./Experiment.js?v=16\";\n\n\nvar camera, renderer;\n\nvar docWidth,docHeight;\n\nvar loader;\nvar mixer;\n\nvar SHADOW_SIZE=2048;\nvar SIZE_DIVIDER=8;\n\nvar alphaCanvas;\nvar betaCanvas;\n\n\nvar activeCanvas;\n\nvar composer;\n\nvar specterMaterial;\nvar SCENE_IMPORT;\n\n\nfunction init(data,initialScene){\n    if(initialScene)\n        activeScene=initialScene;\n\n    SCENE_IMPORT=data;\n    camera = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"PerspectiveCamera\"]( 45, window.innerWidth / window.innerHeight, 1, 5000 );\n    camera.position.z = 100; //400\n    camera.position.y = -200; //-800\n    camera.up=new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"](0,0,1)\n\n    camera.lookAt(new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"]( 0, 100, 0 ));\n\n    \n\n    alphaCanvas=document.createElement('div');\n    betaCanvas=document.createElement('div');\n    alphaCanvas.classList.add('canvasHolder');\n    betaCanvas.classList.add('canvasHolder');\n    betaCanvas.style.background='#fff5'\n    alphaCanvas.reserved=false;\n    betaCanvas.reserved=false;\n\n\n    renderer = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"WebGLRenderer\"]({alpha: true, antialias:true});\n    renderer.shadowMap.enabled = true;\n    renderer.shadowMap.type = _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"PCFSoftShadowMap\"];\n\n    renderer.setClearColor(0x000000, 0);//0xb0e9fd,1);//0xb0e9fd,1)\n\n    alphaCanvas.appendChild( renderer.domElement );\n\n    loader = new _lib_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_2__[\"GLTFLoader\"]();\n\n    initCustomMaterial();\n\n    sceneInit();\n    activeCanvas=alphaCanvas;\n\n\n    window.addEventListener('resize',resizer);\n    resizer();\n\n\n    composer = new _lib_EffectComposer_js__WEBPACK_IMPORTED_MODULE_3__[\"EffectComposer\"]( renderer );\n    var luminosityPass = new _lib_ShaderPass_js__WEBPACK_IMPORTED_MODULE_4__[\"ShaderPass\"]( _lib_LuminosityShader_js__WEBPACK_IMPORTED_MODULE_5__[\"LuminosityShader\"] );\n    composer.addPass( luminosityPass );\n    \n\n    animate();\n\n    \n}\nfunction getAlphaCanvas(){\n    return alphaCanvas;\n}\nfunction getBetaCanvas(){\n    return betaCanvas;\n}\n\nfunction loadModel(model,callback,texture,color){\n    loader.load(\n        ('./'+model),//villager22.gltf',\n        ( gltf ) => {\n            // called when the resource is loaded\n            //gltf.scene.scale.set(10,10,10);\n            let model;//=gltf.scene.children[0];\n            gltf.scene.rotation.x=Math.PI/2;\n            gltf.scene.traverse( function ( child ) {\n                if (child instanceof _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"]) {\n                    //if(child.name==\"Cube\"){\n                        model=child;\n                        if(!texture){\n                            if(color)\n                                child.material = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"MeshStandardMaterial\"]({ color: color, metalness: 0, roughness: 1.0}); // \n                            else\n                                child.material = specterMaterial; //new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors, metalness: 0, roughness: 1.0}); // \n                          \n                            child.material.needsUpdate = true;\n                            //child.material.skinning=true;\n                        }\n                        //child.material.morphTargets=true;\n\n                        //child.material.map.needsUpdate = true;\n                   // }else{\n\n                    //}\n                }\n            });\n            //gltf.scene.children[0].children[1].scale.set(20,20,20);\n            //gltf.scene.children.pop();\n            //let mixer = new THREE.AnimationMixer( gltf.scene );\n             //model=gltf.scene.children[0]\n             let m2=gltf.scene.children[0];\n             if(model){\n                var animations = gltf.animations;\n                if ( animations && animations.length ) {\n\n                    mixer = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"AnimationMixer\"](model);\n                    for ( var i = 0; i < animations.length; i ++ ) {\n                        var animation = animations[ i ];\n                        // There's .3333 seconds junk at the tail of the Monster animation that\n                        // keeps it from looping cleanly. Clip it at 3 seconds\n\n                        //if ( sceneInfo.animationTime ) {\n                        //    animation.duration = sceneInfo.animationTime;\n\n\n                       // }\n                        action = mixer.clipAction( animation );\n                        //action.setEffectiveTimeScale(200);\n                        //action.timeScale=0.002;\n                        action.timeScale=0.002;\n                        //if ( state.playAnimation ) \n                            action.play();\n                    }\n                }\n                 //mainScene.add( gltf.scene.children[0] );\n             }\n            callback(gltf.scene);\n        },\n        ( xhr ) => {\n            // called while loading is progressing\n            console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );\n        },\n        ( error ) => {\n            // called when loading has errors\n            console.error( 'An error happened', error );\n        },\n    );\n}\n\nfunction resizer(){\n    docWidth=window.innerWidth;\n    docHeight=window.innerHeight;\n    camera.aspect=docWidth/docHeight;\n    camera.updateProjectionMatrix();\n    \n    renderer.setPixelRatio( window.devicePixelRatio/SIZE_DIVIDER);\n    renderer.setSize( docWidth, docHeight);\n}\n\n\nfunction animate(time) {\n   sceneAnimate();\n    renderer.render( getScene(), camera );\n    //composer.render();\n    requestAnimationFrame( animate );\n}\nfunction dumpImage(img){\n    let dom=document.querySelector('#afterImage');\n    if(dom)\n        dom.setAttribute('src',img);\n}\nfunction bufferPrint(){\n    //_grabImage=true;\n    renderer.render( getScene(), camera );\n    dumpImage(renderer.domElement.toDataURL());\n}\n\nvar anchors=[];\nfunction addAnchor(host,bubble){\n    let anchor={\n        host:host,\n        bubble:bubble,\n        x:0,\n        y:0,\n        offset:0,\n    }\n    anchors.forEach(a=>{\n        if(a.host==host){\n            a.offset-=40;\n        }\n    })\n    anchors.push(anchor);\n    console.log(anchors.length+' anchors');\n    updateAnchor(anchor,anchors.length-1);\n    return anchor;\n}\nfunction updateAnchor(anchor,index){\n    if(!anchor.bubble){\n        anchors.splice(index,1);\n        return false;\n    }\n    if(anchor.host){\n        let vector=projectVector(anchor.host);\n        anchor.bubble.style.left=-16+vector.x+'px';\n        anchor.bubble.style.top=(40+anchor.offset+vector.y)+'px';\n        anchor.x=vector.x;\n        anchor.y=vector.y;\n    }\n    \n}\nfunction roundEdge(x){\n    x=x%(Math.PI)\n    if(x<0)\n        x+=Math.PI*2;\n    \n    if(x>Math.PI/4){\n        if(x>5*Math.PI/4){\n            if(x<7*Math.PI/4){\n                return Math.PI*3/2;\n            }\n        }else{\n            if(x>3*Math.PI/4){\n                return Math.PI;\n            }else{\n                return Math.PI/2;\n            }\n        }\n    }\n    return 0;\n}\n\nfunction syncModel(index,obj){\n\tlet m=modelsIndexed[index];\n\tm.position.x=obj.x;\n\tm.position.y=obj.y;\n\tm.position.z=obj.z;\n}\nfunction createModel(index){\n\tlet model = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"]( cubeGeometry, cubeMaterial );\n\tmodelsIndexed[index]=model;\n\treturn model;\n}\n/*\nfunction cubit(w,h,d,x,y,z,color,layer){\n\tlet geom = new THREE.BoxBufferGeometry( w, h, d );\n    let mat;\n    if(color)\n        mat=new THREE.MeshStandardMaterial( { color: parseInt(color)} );\n    \n\tlet model = new THREE.Mesh( geom,mat);\n\tmodel.position.x=x;\n\tmodel.position.y=y;\n\tmodel.position.z=z;\n    model.castShadow=true;\n    model.receiveShadow=true;\n    if(layer!=undefined && scenes[layer]){\n        scenes[layer].add(model);\n    }else\n\t   scenes[0].add(model);\n    return model;\n}*/\nfunction getRandomColor() {\n  var letters = '0123456789ABCDEF';\n  var color = Math.random()>0.5?0x66B136:0x76610E;\n  return parseInt(color);\n}\n\nfunction applyCursor(){\n\tif(Control.down()){\n        pointer.material=pointerMatOn;\n    }else\n        pointer.material=pointerMat;\n\t\tvar vector = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"]();     \n\t    vector.set(( Control.screenX() / window.innerWidth ) * 2 - 1, - ( Control.screenY() / window.innerHeight ) * 2 + 1,0.5 );\n\t    vector.unproject(camera)\n\t    var dir = vector.sub( camera.position ).normalize();\n\t    var distance = - camera.position.z / dir.z;\n\t    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );\n\t    \n\t    pointer.position.x =pos.x;\n\t    pointer.position.y =pos.y\n\t    Control.setVector(pointer.position);\n\t\n}\nfunction projectVector(object){\n\n    var width = docWidth, height = docHeight;\n    var widthHalf = width / 2, heightHalf = height / 2;\n\n    let vector=object.position.clone();\n    vector.z+=30\n    //vector.applyMatrix4(object.matrixWorld);\n    vector.project(camera)\n\n    //var projector = new THREE.Projector();\n    //projector.projectVector( vector.setFromMatrixPosition( object.matrixWorld ), camera );\n\n    vector.x = ( vector.x * widthHalf ) + widthHalf;\n    vector.y = - ( vector.y * heightHalf ) + heightHalf;\n    return vector;\n\n}\n\n\nvar specterMaterial\nfunction initCustomMaterial(){\n\n    var meshphysical_frag = `\n    #define STANDARD\n#ifdef PHYSICAL\n    #define REFLECTIVITY\n    #define CLEARCOAT\n    #define TRANSPARENCY\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef TRANSPARENCY\n    uniform float transparency;\n#endif\n#ifdef REFLECTIVITY\n    uniform float reflectivity;\n#endif\n#ifdef CLEARCOAT\n    uniform float clearcoat;\n    uniform float clearcoatRoughness;\n#endif\n#ifdef USE_SHEEN\n    uniform vec3 sheen;\n#endif\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n    varying vec3 vNormal;\n    #ifdef USE_TANGENT\n        varying vec3 vTangent;\n        varying vec3 vBitangent;\n    #endif\n#endif\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <bsdfs>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <lights_physical_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n    #include <clipping_planes_fragment>\n    vec4 diffuseColor = vec4( diffuse, opacity );\n    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n    vec3 totalEmissiveRadiance = emissive;\n    #include <logdepthbuf_fragment>\n    #include <map_fragment>\n    #include <color_fragment>\n    #include <alphamap_fragment>\n    #include <alphatest_fragment>\n    #include <roughnessmap_fragment>\n    #include <metalnessmap_fragment>\n    #include <normal_fragment_begin>\n    #include <normal_fragment_maps>\n    #include <clearcoat_normal_fragment_begin>\n    #include <clearcoat_normal_fragment_maps>\n    #include <emissivemap_fragment>\n    #include <lights_physical_fragment>\n    #include <lights_fragment_begin>\n    #include <lights_fragment_maps>\n    #include <lights_fragment_end>\n    #include <aomap_fragment>\n    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n    #ifdef TRANSPARENCY\n        diffuseColor.a *= saturate( 1. - transparency + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) );\n    #endif\n    gl_FragColor = vec4( outgoingLight,1.-(((0.2125 * outgoingLight.r) + (0.7154 * outgoingLight.g) + (0.0721 * outgoingLight.b)) ) );\n    #include <tonemapping_fragment>\n    #include <encodings_fragment>\n    #include <fog_fragment>\n    #include <premultiplied_alpha_fragment>\n    #include <dithering_fragment>\n}`\n\n//gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\n\n/*\n#ifdef USE_COLOR\n            if(vColor==vec3(0,0,1))\n                diffuseColor.rgb *= vec3(1,0,0);\n            else\n                diffuseColor.rgb *= vColor;\n    #endif*/\n\n    //    #include <color_vertex>\n\n    var meshphysical_vert = `#define STANDARD\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n    varying vec3 vNormal;\n    #ifdef USE_TANGENT\n        varying vec3 vTangent;\n        varying vec3 vBitangent;\n    #endif\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nuniform vec3 shirt;\nuniform vec3 wind;\n\nvoid main() {\n    #include <uv_vertex>\n    #include <uv2_vertex>\n    #ifdef USE_COLOR\n        if(color==vec3(0,0,1))\n            vColor.xyz = shirt;\n        else\n            vColor.xyz = color.xyz;\n        \n    #endif\n    #include <beginnormal_vertex>\n    #include <morphnormal_vertex>\n    #include <skinbase_vertex>\n    #include <skinnormal_vertex>\n    #include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n    vNormal = normalize( transformedNormal );\n    #ifdef USE_TANGENT\n        vTangent = normalize( transformedTangent );\n        vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n    #endif\n#endif\n    #include <begin_vertex>\n    #include <morphtarget_vertex>\n    #include <skinning_vertex>\n    #include <displacementmap_vertex>\n\n    \n        if(color==vec3(1,0,0)){\n            float val=max(0.0, 1.0976 - transformed.z);\n            transformed.xyz+=val*wind;\n            transformed.y*=1.0+sin((wind.z+transformed.z)*4.0)/2.0;\n\n        }\n    \n\n    #include <project_vertex>\n    #include <logdepthbuf_vertex>\n    #include <clipping_planes_vertex>\n    vViewPosition = - mvPosition.xyz;\n    #include <worldpos_vertex>\n    #include <shadowmap_vertex>\n    #include <fog_vertex>\n}`\n\n    var uniforms = _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"UniformsUtils\"].merge(\n       [_lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"ShaderLib\"].standard.uniforms,\n       //{shirt: {value:new THREE.Vector3(0,1,0)},\n        //wind: {value:new THREE.Vector3(0,0,0)}}\n        ]\n    );\n\n    /*specterMaterial =  new THREE.ShaderMaterial({\n    uniforms: uniforms,\n    fragmentShader: fragmentShader(),\n    vertexShader: vertexShader(),\n  })**/\n\n\n    specterMaterial=new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"ShaderMaterial\"]( {\n        uniforms: uniforms,\n        derivatives: false,\n        lights: true,\n        vertexColors: true,\n        vertexShader: meshphysical_vert,\n        fragmentShader: meshphysical_frag,\n        roughness: 0.0,\n        metalness: 1.0,\n        //vertexShader: THREE.ShaderChunk.cube_vert,\n        //fragmentShader: THREE.ShaderChunk.cube_frag\n    });\n\n}\n/////SCENE///////\n\nvar emptyScene;\nvar scenes;\n\n\n\nfunction sceneInit() {\n    emptyScene = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Scene\"]();\n    scenes = [];\n\n    let cubeGeometry = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"BoxBufferGeometry\"](20, 20, 20);\n    let cubeMaterial = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"MeshStandardMaterial\"]({ color: 0xff8833 }); //map: texture\n\n    /*\n      var geometry = new THREE.SphereGeometry( 5, 32, 32 );\n      var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );\n      var sphere = new THREE.Mesh( geometry, material );\n\n      sphere.position.set(0,0,-30);\n      cubes.push(sphere);\n      scenes[2].add(sphere);\n      var geo = new THREE.OctahedronGeometry( 30, 1 );\n      var mat = new THREE.MeshBasicMaterial( {color: 0xC92DD1} ); \n      var octa= new THREE.Mesh( geo, mat );\n      octa.position.set(0,0,20);\n      cubes.push(octa);\n      scenes[3].add(octa);*/\n}\n\n\n\nfunction sceneAnimate() {\n    if(activeModule){\n        activeModule.animate()\n    }\n}\n\nfunction flipScene(i) {\n    activeScene = i;\n}\nvar activeScene = 0;\nvar activeModule;\n\nfunction getScene() {\n    let index = activeScene;\n    let scene = scenes[index];\n    if(scene == undefined) {\n        scene = emptyScene\n        scenes[index] = 'pend';\n\n        //wow this is a conufsing mess but it's functional!\n         let importerFunction=SCENE_IMPORT[index];\n         if(importerFunction){\n            _Main_js__WEBPACK_IMPORTED_MODULE_1__[\"pendApp\"](index)\n            importerFunction(module=>{\n                scenes[index]=[module.init('start the feller', _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__),module]\n                _Main_js__WEBPACK_IMPORTED_MODULE_1__[\"clearPendApp\"](index)\n            });\n        }else{\n            scenes[index]=[emptyScene,undefined]\n        }\n\n        /*import(SCENE_DATA[index][0]).then(module => {\n            scenes[index] = module.init(SCENE_DATA[index][1], Render, THREE);\n        })*/\n    } else if(scene == 'pend') {\n        scene = emptyScene;\n    }else{\n        activeModule=scene[1]; //define the module that's currently active so we can run it's animate function in sceneAnimate()\n        scene=scene[0] //please forgive me, trust me it works\n    }\n\n    return scene;\n}\n\n///////////////\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./src/Render.js?");

/***/ })

}]);