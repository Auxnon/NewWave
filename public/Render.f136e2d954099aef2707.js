(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["Render"],{

/***/ "./src/Render.js":
/*!***********************!*\
  !*** ./src/Render.js ***!
  \***********************/
/*! exports provided: init, getAlphaCanvas, getBetaCanvas, bufferPrint, loadModel, flipScene, specterMaterial */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAlphaCanvas\", function() { return getAlphaCanvas; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getBetaCanvas\", function() { return getBetaCanvas; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"bufferPrint\", function() { return bufferPrint; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loadModel\", function() { return loadModel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"flipScene\", function() { return flipScene; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"specterMaterial\", function() { return specterMaterial; });\n/* harmony import */ var _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/three.module.js */ \"./src/lib/three.module.js\");\n/* harmony import */ var _Main_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Main.js */ \"./src/Main.js\");\n/* harmony import */ var _lib_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/GLTFLoader.js */ \"./src/lib/GLTFLoader.js\");\n/* harmony import */ var _lib_EffectComposer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/EffectComposer.js */ \"./src/lib/EffectComposer.js\");\n/* harmony import */ var _lib_ShaderPass_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/ShaderPass.js */ \"./src/lib/ShaderPass.js\");\n/* harmony import */ var _lib_LuminosityShader_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/LuminosityShader.js */ \"./src/lib/LuminosityShader.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n//import * as Control from \"./Control.js?v=16\";\r\n//import * as World from \"./World.js?v=16\";\r\n//import {OrbitControls} from \"./lib/OrbitControls.js\";\r\n//import * as Texture from \"./Texture.js?v=16\";\r\n//import * as Stats from \"./lib/stats.js\";\r\n//import * as AssetManager from \"./AssetManager.js?v=16\";\r\n//import * as Experiment from \"./Experiment.js?v=16\";\r\n\r\n\r\nvar camera, renderer;\r\n\r\nvar docWidth,docHeight;\r\n\r\nvar loader;\r\nvar mixer;\r\n\r\nvar SHADOW_SIZE=2048;\r\nvar SIZE_DIVIDER=2;\r\n\r\nvar alphaCanvas;\r\nvar betaCanvas;\r\n\r\n\r\nvar activeCanvas;\r\n\r\nvar composer;\r\n\r\nvar specterMaterial;\r\nvar SCENE_IMPORT;\r\n\r\n\r\nfunction init(data,initialScene){\r\n    if(initialScene)\r\n        activeScene=initialScene;\r\n\r\n    SCENE_IMPORT=data;\r\n    camera = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"PerspectiveCamera\"]( 45, window.innerWidth / window.innerHeight, 1, 5000 );\r\n    camera.position.z = 100; //400\r\n    camera.position.y = -200; //-800\r\n    camera.up=new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"](0,0,1)\r\n\r\n    camera.lookAt(new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"]( 0, 100, 0 ));\r\n\r\n    \r\n\r\n    alphaCanvas=document.createElement('div');\r\n    betaCanvas=document.createElement('div');\r\n    alphaCanvas.classList.add('canvasHolder');\r\n    betaCanvas.classList.add('canvasHolder');\r\n    betaCanvas.style.background='#fff5'\r\n    alphaCanvas.reserved=false;\r\n    betaCanvas.reserved=false;\r\n\r\n\r\n    renderer = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"WebGLRenderer\"]({alpha: true, antialias:true});\r\n    renderer.shadowMap.enabled = true;\r\n    renderer.shadowMap.type = _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"PCFSoftShadowMap\"];\r\n\r\n    renderer.setClearColor(0x000000, 0);//0xb0e9fd,1);//0xb0e9fd,1)\r\n\r\n    alphaCanvas.appendChild( renderer.domElement );\r\n\r\n    loader = new _lib_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_2__[\"GLTFLoader\"]();\r\n\r\n    initCustomMaterial();\r\n\r\n    sceneInit();\r\n    activeCanvas=alphaCanvas;\r\n\r\n\r\n    window.addEventListener('resize',resizer);\r\n    resizer();\r\n\r\n\r\n    composer = new _lib_EffectComposer_js__WEBPACK_IMPORTED_MODULE_3__[\"EffectComposer\"]( renderer );\r\n    var luminosityPass = new _lib_ShaderPass_js__WEBPACK_IMPORTED_MODULE_4__[\"ShaderPass\"]( _lib_LuminosityShader_js__WEBPACK_IMPORTED_MODULE_5__[\"LuminosityShader\"] );\r\n    composer.addPass( luminosityPass );\r\n    \r\n\r\n    animate();\r\n\r\n    \r\n}\r\nfunction getAlphaCanvas(){\r\n    return alphaCanvas;\r\n}\r\nfunction getBetaCanvas(){\r\n    return betaCanvas;\r\n}\r\n\r\nfunction loadModel(model,callback,texture,color){\r\n    loader.load(\r\n        ('./'+model),//villager22.gltf',\r\n        ( gltf ) => {\r\n            // called when the resource is loaded\r\n            //gltf.scene.scale.set(10,10,10);\r\n            let model;//=gltf.scene.children[0];\r\n            gltf.scene.rotation.x=Math.PI/2;\r\n            gltf.scene.traverse( function ( child ) {\r\n                if (child instanceof _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"]) {\r\n                    //if(child.name==\"Cube\"){\r\n                        model=child;\r\n                        if(!texture){\r\n                            if(color)\r\n                                child.material = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"MeshStandardMaterial\"]({ color: color, metalness: 0, roughness: 1.0}); // \r\n                            else\r\n                                child.material = specterMaterial; //new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors, metalness: 0, roughness: 1.0}); // \r\n                          \r\n                            child.material.needsUpdate = true;\r\n                            //child.material.skinning=true;\r\n                        }\r\n                        //child.material.morphTargets=true;\r\n\r\n                        //child.material.map.needsUpdate = true;\r\n                   // }else{\r\n\r\n                    //}\r\n                }\r\n            });\r\n            //gltf.scene.children[0].children[1].scale.set(20,20,20);\r\n            //gltf.scene.children.pop();\r\n            //let mixer = new THREE.AnimationMixer( gltf.scene );\r\n             //model=gltf.scene.children[0]\r\n             let m2=gltf.scene.children[0];\r\n             if(model){\r\n                var animations = gltf.animations;\r\n                if ( animations && animations.length ) {\r\n\r\n                    mixer = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"AnimationMixer\"](model);\r\n                    for ( var i = 0; i < animations.length; i ++ ) {\r\n                        var animation = animations[ i ];\r\n                        // There's .3333 seconds junk at the tail of the Monster animation that\r\n                        // keeps it from looping cleanly. Clip it at 3 seconds\r\n\r\n                        //if ( sceneInfo.animationTime ) {\r\n                        //    animation.duration = sceneInfo.animationTime;\r\n\r\n\r\n                       // }\r\n                        action = mixer.clipAction( animation );\r\n                        //action.setEffectiveTimeScale(200);\r\n                        //action.timeScale=0.002;\r\n                        action.timeScale=0.002;\r\n                        //if ( state.playAnimation ) \r\n                            action.play();\r\n                    }\r\n                }\r\n                 //mainScene.add( gltf.scene.children[0] );\r\n             }\r\n            callback(gltf.scene);\r\n        },\r\n        ( xhr ) => {\r\n            // called while loading is progressing\r\n            console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );\r\n        },\r\n        ( error ) => {\r\n            // called when loading has errors\r\n            console.error( 'An error happened', error );\r\n        },\r\n    );\r\n}\r\n\r\nfunction resizer(){\r\n    docWidth=window.innerWidth;\r\n    docHeight=window.innerHeight;\r\n    camera.aspect=docWidth/docHeight;\r\n    camera.updateProjectionMatrix();\r\n    \r\n    renderer.setPixelRatio( window.devicePixelRatio/SIZE_DIVIDER);\r\n    renderer.setSize( docWidth, docHeight);\r\n}\r\n\r\n\r\nfunction animate(time) {\r\n   sceneAnimate();\r\n    renderer.render( getScene(), camera );\r\n    //composer.render();\r\n    requestAnimationFrame( animate );\r\n}\r\nfunction dumpImage(img){\r\n    let dom=document.querySelector('#afterImage');\r\n    if(dom)\r\n        dom.setAttribute('src',img);\r\n}\r\nfunction bufferPrint(){\r\n    //_grabImage=true;\r\n    renderer.render( getScene(), camera );\r\n    dumpImage(renderer.domElement.toDataURL());\r\n}\r\n\r\nvar anchors=[];\r\nfunction addAnchor(host,bubble){\r\n    let anchor={\r\n        host:host,\r\n        bubble:bubble,\r\n        x:0,\r\n        y:0,\r\n        offset:0,\r\n    }\r\n    anchors.forEach(a=>{\r\n        if(a.host==host){\r\n            a.offset-=40;\r\n        }\r\n    })\r\n    anchors.push(anchor);\r\n    console.log(anchors.length+' anchors');\r\n    updateAnchor(anchor,anchors.length-1);\r\n    return anchor;\r\n}\r\nfunction updateAnchor(anchor,index){\r\n    if(!anchor.bubble){\r\n        anchors.splice(index,1);\r\n        return false;\r\n    }\r\n    if(anchor.host){\r\n        let vector=projectVector(anchor.host);\r\n        anchor.bubble.style.left=-16+vector.x+'px';\r\n        anchor.bubble.style.top=(40+anchor.offset+vector.y)+'px';\r\n        anchor.x=vector.x;\r\n        anchor.y=vector.y;\r\n    }\r\n    \r\n}\r\nfunction roundEdge(x){\r\n    x=x%(Math.PI)\r\n    if(x<0)\r\n        x+=Math.PI*2;\r\n    \r\n    if(x>Math.PI/4){\r\n        if(x>5*Math.PI/4){\r\n            if(x<7*Math.PI/4){\r\n                return Math.PI*3/2;\r\n            }\r\n        }else{\r\n            if(x>3*Math.PI/4){\r\n                return Math.PI;\r\n            }else{\r\n                return Math.PI/2;\r\n            }\r\n        }\r\n    }\r\n    return 0;\r\n}\r\n\r\nfunction syncModel(index,obj){\r\n\tlet m=modelsIndexed[index];\r\n\tm.position.x=obj.x;\r\n\tm.position.y=obj.y;\r\n\tm.position.z=obj.z;\r\n}\r\nfunction createModel(index){\r\n\tlet model = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"]( cubeGeometry, cubeMaterial );\r\n\tmodelsIndexed[index]=model;\r\n\treturn model;\r\n}\r\n/*\r\nfunction cubit(w,h,d,x,y,z,color,layer){\r\n\tlet geom = new THREE.BoxBufferGeometry( w, h, d );\r\n    let mat;\r\n    if(color)\r\n        mat=new THREE.MeshStandardMaterial( { color: parseInt(color)} );\r\n    \r\n\tlet model = new THREE.Mesh( geom,mat);\r\n\tmodel.position.x=x;\r\n\tmodel.position.y=y;\r\n\tmodel.position.z=z;\r\n    model.castShadow=true;\r\n    model.receiveShadow=true;\r\n    if(layer!=undefined && scenes[layer]){\r\n        scenes[layer].add(model);\r\n    }else\r\n\t   scenes[0].add(model);\r\n    return model;\r\n}*/\r\nfunction getRandomColor() {\r\n  var letters = '0123456789ABCDEF';\r\n  var color = Math.random()>0.5?0x66B136:0x76610E;\r\n  return parseInt(color);\r\n}\r\n\r\nfunction applyCursor(){\r\n\tif(Control.down()){\r\n        pointer.material=pointerMatOn;\r\n    }else\r\n        pointer.material=pointerMat;\r\n\t\tvar vector = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"]();     \r\n\t    vector.set(( Control.screenX() / window.innerWidth ) * 2 - 1, - ( Control.screenY() / window.innerHeight ) * 2 + 1,0.5 );\r\n\t    vector.unproject(camera)\r\n\t    var dir = vector.sub( camera.position ).normalize();\r\n\t    var distance = - camera.position.z / dir.z;\r\n\t    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );\r\n\t    \r\n\t    pointer.position.x =pos.x;\r\n\t    pointer.position.y =pos.y\r\n\t    Control.setVector(pointer.position);\r\n\t\r\n}\r\nfunction projectVector(object){\r\n\r\n    var width = docWidth, height = docHeight;\r\n    var widthHalf = width / 2, heightHalf = height / 2;\r\n\r\n    let vector=object.position.clone();\r\n    vector.z+=30\r\n    //vector.applyMatrix4(object.matrixWorld);\r\n    vector.project(camera)\r\n\r\n    //var projector = new THREE.Projector();\r\n    //projector.projectVector( vector.setFromMatrixPosition( object.matrixWorld ), camera );\r\n\r\n    vector.x = ( vector.x * widthHalf ) + widthHalf;\r\n    vector.y = - ( vector.y * heightHalf ) + heightHalf;\r\n    return vector;\r\n\r\n}\r\n\r\n\r\nvar specterMaterial\r\nfunction initCustomMaterial(){\r\n\r\n    var meshphysical_frag = `\r\n    #define STANDARD\r\n#ifdef PHYSICAL\r\n    #define REFLECTIVITY\r\n    #define CLEARCOAT\r\n    #define TRANSPARENCY\r\n#endif\r\nuniform vec3 diffuse;\r\nuniform vec3 emissive;\r\nuniform float roughness;\r\nuniform float metalness;\r\nuniform float opacity;\r\n#ifdef TRANSPARENCY\r\n    uniform float transparency;\r\n#endif\r\n#ifdef REFLECTIVITY\r\n    uniform float reflectivity;\r\n#endif\r\n#ifdef CLEARCOAT\r\n    uniform float clearcoat;\r\n    uniform float clearcoatRoughness;\r\n#endif\r\n#ifdef USE_SHEEN\r\n    uniform vec3 sheen;\r\n#endif\r\nvarying vec3 vViewPosition;\r\n#ifndef FLAT_SHADED\r\n    varying vec3 vNormal;\r\n    #ifdef USE_TANGENT\r\n        varying vec3 vTangent;\r\n        varying vec3 vBitangent;\r\n    #endif\r\n#endif\r\n#include <common>\r\n#include <packing>\r\n#include <dithering_pars_fragment>\r\n#include <color_pars_fragment>\r\n#include <uv_pars_fragment>\r\n#include <uv2_pars_fragment>\r\n#include <map_pars_fragment>\r\n#include <alphamap_pars_fragment>\r\n#include <aomap_pars_fragment>\r\n#include <lightmap_pars_fragment>\r\n#include <emissivemap_pars_fragment>\r\n#include <bsdfs>\r\n#include <cube_uv_reflection_fragment>\r\n#include <envmap_common_pars_fragment>\r\n#include <envmap_physical_pars_fragment>\r\n#include <fog_pars_fragment>\r\n#include <lights_pars_begin>\r\n#include <lights_physical_pars_fragment>\r\n#include <shadowmap_pars_fragment>\r\n#include <bumpmap_pars_fragment>\r\n#include <normalmap_pars_fragment>\r\n\r\n#include <roughnessmap_pars_fragment>\r\n#include <metalnessmap_pars_fragment>\r\n#include <logdepthbuf_pars_fragment>\r\n#include <clipping_planes_pars_fragment>\r\nvoid main() {\r\n    #include <clipping_planes_fragment>\r\n    vec4 diffuseColor = vec4( diffuse, opacity );\r\n    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\r\n    vec3 totalEmissiveRadiance = emissive;\r\n    #include <logdepthbuf_fragment>\r\n    #include <map_fragment>\r\n    #include <color_fragment>\r\n    #include <alphamap_fragment>\r\n    #include <alphatest_fragment>\r\n    #include <roughnessmap_fragment>\r\n    #include <metalnessmap_fragment>\r\n    #include <normal_fragment_begin>\r\n    #include <normal_fragment_maps>\r\n    #include <clearcoat_normal_fragment_begin>\r\n    #include <clearcoat_normal_fragment_maps>\r\n    #include <emissivemap_fragment>\r\n    #include <lights_physical_fragment>\r\n    #include <lights_fragment_begin>\r\n    #include <lights_fragment_maps>\r\n    #include <lights_fragment_end>\r\n    #include <aomap_fragment>\r\n    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\r\n    #ifdef TRANSPARENCY\r\n        diffuseColor.a *= saturate( 1. - transparency + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) );\r\n    #endif\r\n    gl_FragColor = vec4( outgoingLight,1.-(((0.2125 * outgoingLight.r) + (0.7154 * outgoingLight.g) + (0.0721 * outgoingLight.b)) ) );\r\n    #include <tonemapping_fragment>\r\n    #include <encodings_fragment>\r\n    #include <fog_fragment>\r\n    #include <premultiplied_alpha_fragment>\r\n    #include <dithering_fragment>\r\n}`\r\n\r\n//gl_FragColor = vec4( outgoingLight, diffuseColor.a );\r\n\r\n\r\n/*\r\n#ifdef USE_COLOR\r\n            if(vColor==vec3(0,0,1))\r\n                diffuseColor.rgb *= vec3(1,0,0);\r\n            else\r\n                diffuseColor.rgb *= vColor;\r\n    #endif*/\r\n\r\n    //    #include <color_vertex>\r\n\r\n    var meshphysical_vert = `#define STANDARD\r\nvarying vec3 vViewPosition;\r\n#ifndef FLAT_SHADED\r\n    varying vec3 vNormal;\r\n    #ifdef USE_TANGENT\r\n        varying vec3 vTangent;\r\n        varying vec3 vBitangent;\r\n    #endif\r\n#endif\r\n#include <common>\r\n#include <uv_pars_vertex>\r\n#include <uv2_pars_vertex>\r\n#include <displacementmap_pars_vertex>\r\n#include <color_pars_vertex>\r\n#include <fog_pars_vertex>\r\n#include <morphtarget_pars_vertex>\r\n#include <skinning_pars_vertex>\r\n#include <shadowmap_pars_vertex>\r\n#include <logdepthbuf_pars_vertex>\r\n#include <clipping_planes_pars_vertex>\r\n\r\nuniform vec3 shirt;\r\nuniform vec3 wind;\r\n\r\nvoid main() {\r\n    #include <uv_vertex>\r\n    #include <uv2_vertex>\r\n    #ifdef USE_COLOR\r\n        if(color==vec3(0,0,1))\r\n            vColor.xyz = shirt;\r\n        else\r\n            vColor.xyz = color.xyz;\r\n        \r\n    #endif\r\n    #include <beginnormal_vertex>\r\n    #include <morphnormal_vertex>\r\n    #include <skinbase_vertex>\r\n    #include <skinnormal_vertex>\r\n    #include <defaultnormal_vertex>\r\n#ifndef FLAT_SHADED\r\n    vNormal = normalize( transformedNormal );\r\n    #ifdef USE_TANGENT\r\n        vTangent = normalize( transformedTangent );\r\n        vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\r\n    #endif\r\n#endif\r\n    #include <begin_vertex>\r\n    #include <morphtarget_vertex>\r\n    #include <skinning_vertex>\r\n    #include <displacementmap_vertex>\r\n\r\n    \r\n        if(color==vec3(1,0,0)){\r\n            float val=max(0.0, 1.0976 - transformed.z);\r\n            transformed.xyz+=val*wind;\r\n            transformed.y*=1.0+sin((wind.z+transformed.z)*4.0)/2.0;\r\n\r\n        }\r\n    \r\n\r\n    #include <project_vertex>\r\n    #include <logdepthbuf_vertex>\r\n    #include <clipping_planes_vertex>\r\n    vViewPosition = - mvPosition.xyz;\r\n    #include <worldpos_vertex>\r\n    #include <shadowmap_vertex>\r\n    #include <fog_vertex>\r\n}`\r\n\r\n    var uniforms = _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"UniformsUtils\"].merge(\r\n       [_lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"ShaderLib\"].standard.uniforms,\r\n       //{shirt: {value:new THREE.Vector3(0,1,0)},\r\n        //wind: {value:new THREE.Vector3(0,0,0)}}\r\n        ]\r\n    );\r\n\r\n    /*specterMaterial =  new THREE.ShaderMaterial({\r\n    uniforms: uniforms,\r\n    fragmentShader: fragmentShader(),\r\n    vertexShader: vertexShader(),\r\n  })**/\r\n\r\n\r\n    specterMaterial=new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"ShaderMaterial\"]( {\r\n        uniforms: uniforms,\r\n        derivatives: false,\r\n        lights: true,\r\n        vertexColors: true,\r\n        vertexShader: meshphysical_vert,\r\n        fragmentShader: meshphysical_frag,\r\n        roughness: 0.0,\r\n        metalness: 1.0,\r\n        //vertexShader: THREE.ShaderChunk.cube_vert,\r\n        //fragmentShader: THREE.ShaderChunk.cube_frag\r\n    });\r\n\r\n}\r\n/////SCENE///////\r\n\r\nvar emptyScene;\r\nvar scenes;\r\n\r\n\r\n\r\nfunction sceneInit() {\r\n    emptyScene = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Scene\"]();\r\n    scenes = [];\r\n\r\n    let cubeGeometry = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"BoxBufferGeometry\"](20, 20, 20);\r\n    let cubeMaterial = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"MeshStandardMaterial\"]({ color: 0xff8833 }); //map: texture\r\n\r\n    /*\r\n      var geometry = new THREE.SphereGeometry( 5, 32, 32 );\r\n      var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );\r\n      var sphere = new THREE.Mesh( geometry, material );\r\n\r\n      sphere.position.set(0,0,-30);\r\n      cubes.push(sphere);\r\n      scenes[2].add(sphere);\r\n      var geo = new THREE.OctahedronGeometry( 30, 1 );\r\n      var mat = new THREE.MeshBasicMaterial( {color: 0xC92DD1} ); \r\n      var octa= new THREE.Mesh( geo, mat );\r\n      octa.position.set(0,0,20);\r\n      cubes.push(octa);\r\n      scenes[3].add(octa);*/\r\n}\r\n\r\n\r\n\r\nfunction sceneAnimate() {\r\n    if(activeModule){\r\n        activeModule.animate()\r\n    }\r\n}\r\n\r\nfunction flipScene(i) {\r\n    activeScene = i;\r\n}\r\nvar activeScene = 0;\r\nvar activeModule;\r\n\r\nfunction getScene() {\r\n    let index = activeScene;\r\n    let scene = scenes[index];\r\n    if(scene == undefined) {\r\n        scene = emptyScene\r\n        scenes[index] = 'pend';\r\n\r\n        //wow this is a conufsing mess but it's functional!\r\n         let importerFunction=SCENE_IMPORT[index];\r\n         if(importerFunction){\r\n            _Main_js__WEBPACK_IMPORTED_MODULE_1__[\"pendApp\"](index)\r\n            importerFunction(module=>{\r\n                scenes[index]=[module.init('start the feller', _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__),module]\r\n                _Main_js__WEBPACK_IMPORTED_MODULE_1__[\"clearPendApp\"](index)\r\n            });\r\n        }else{\r\n            scenes[index]=[emptyScene,undefined]\r\n        }\r\n\r\n        /*import(SCENE_DATA[index][0]).then(module => {\r\n            scenes[index] = module.init(SCENE_DATA[index][1], Render, THREE);\r\n        })*/\r\n    } else if(scene == 'pend') {\r\n        scene = emptyScene;\r\n    }else{\r\n        activeModule=scene[1]; //define the module that's currently active so we can run it's animate function in sceneAnimate()\r\n        scene=scene[0] //please forgive me, trust me it works\r\n    }\r\n\r\n    return scene;\r\n}\r\n\r\n///////////////\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/Render.js?");

/***/ })

}]);