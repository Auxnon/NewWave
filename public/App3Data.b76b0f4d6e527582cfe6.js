(window.webpackJsonp=window.webpackJsonp||[]).push([[3,4],{10:function(n,e,i){"use strict";i.r(e),i.d(e,"init",(function(){return o})),i.d(e,"animate",(function(){return d})),i.d(e,"deinit",(function(){return l}));var t,r=i(1),a=i(2);function o(n,e){let i=new r.db;var o=new r.a(16777215);i.add(o);var d=new r.m(16777215,.6);d.position.set(0,1,0),d.castShadow=!0,i.add(d);var l=new r.Q;l.position.set(-20,0,-20),i.add(l),d.target=l,t=[];let c=new r.f(20,20,40),f=a.specterMaterial,s=new r.I(c,f);s.position.set(-40,0,0),t.push(s),i.add(s),a.specterMaterial.color=13972009;var u=new r.I(new r.l(20,20,4),new r.K({color:13972009}));return u.position.set(40,0,0),t.push(u),i.add(u),function(n,e,i){i||(i=new r.pb(0,0,0));let t=80/n.length,a=new r.f(t/2,10,15),o=16766513;for(let d=0;d<n.length;d++){let l=(72-n[d])/3,c=-2794504*l+o;console.log(l);let f=new r.I(a,new r.K({color:c}));f.position.set(d*t-40+i.x,i.y,4*l+i.z+10),f.scale.set(1,1,l),e.add(f)}}([70.114,69.14,69.14,68.653,68.653,69.14,68.653,69.627,69.627,68.653,69.627,69.14,69.14,68.653,70.114,69.14,69.14,69.14,68.653,69.14],i,new r.pb(0,0,30)),e(),i}function d(){t.forEach(n=>{n.rotation.x=Math.PI/2,n.rotation.y+=.02})}function l(){}},2:function(n,e,i){"use strict";i.r(e),i.d(e,"init",(function(){return w})),i.d(e,"getAlphaCanvas",(function(){return x})),i.d(e,"getBetaCanvas",(function(){return A})),i.d(e,"bufferPrint",(function(){return L})),i.d(e,"loadModel",(function(){return b})),i.d(e,"flipScene",(function(){return R})),i.d(e,"specterMaterial",(function(){return S})),i.d(e,"resize",(function(){return y}));var t,r,a,o,d,l,c,f,s,u,m=i(1),g=i(0),p=i(4),_=i(6),v=i(3),h=i(5);function w(n,e){var i;e&&(z=e),u=n,(t=new m.T(45,window.innerWidth/window.innerHeight,1,5e3)).position.z=100,t.position.y=-200,t.up=new m.pb(0,0,1),t.lookAt(new m.pb(0,100,0)),c=document.createElement("div"),f=document.createElement("div"),c.classList.add("canvasHolder"),f.classList.add("canvasHolder"),f.style.background="#fff5",c.reserved=!1,f.reserved=!1,(r=new m.tb({alpha:!0,antialias:!0})).shadowMap.enabled=!0,r.shadowMap.type=m.S,r.setClearColor(0,0),c.appendChild(r.domElement),d=new p.a,i=m.nb.merge([m.eb.standard.uniforms]),S=new m.fb({uniforms:i,derivatives:!1,lights:!0,vertexColors:!0,vertexShader:"#define STANDARD\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n    varying vec3 vNormal;\n    #ifdef USE_TANGENT\n        varying vec3 vTangent;\n        varying vec3 vBitangent;\n    #endif\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nuniform vec3 shirt;\nuniform vec3 wind;\n\nvoid main() {\n    #include <uv_vertex>\n    #include <uv2_vertex>\n    #ifdef USE_COLOR\n        if(color==vec3(0,0,1))\n            vColor.xyz = shirt;\n        else\n            vColor.xyz = color.xyz;\n        \n    #endif\n    #include <beginnormal_vertex>\n    #include <morphnormal_vertex>\n    #include <skinbase_vertex>\n    #include <skinnormal_vertex>\n    #include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n    vNormal = normalize( transformedNormal );\n    #ifdef USE_TANGENT\n        vTangent = normalize( transformedTangent );\n        vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n    #endif\n#endif\n    #include <begin_vertex>\n    #include <morphtarget_vertex>\n    #include <skinning_vertex>\n    #include <displacementmap_vertex>\n\n    \n        if(color==vec3(1,0,0)){\n            float val=max(0.0, 1.0976 - transformed.z);\n            transformed.xyz+=val*wind;\n            transformed.y*=1.0+sin((wind.z+transformed.z)*4.0)/2.0;\n\n        }\n    \n\n    #include <project_vertex>\n    #include <logdepthbuf_vertex>\n    #include <clipping_planes_vertex>\n    vViewPosition = - mvPosition.xyz;\n    #include <worldpos_vertex>\n    #include <shadowmap_vertex>\n    #include <fog_vertex>\n}",fragmentShader:"\n    #define STANDARD\n#ifdef PHYSICAL\n    #define REFLECTIVITY\n    #define CLEARCOAT\n    #define TRANSPARENCY\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef TRANSPARENCY\n    uniform float transparency;\n#endif\n#ifdef REFLECTIVITY\n    uniform float reflectivity;\n#endif\n#ifdef CLEARCOAT\n    uniform float clearcoat;\n    uniform float clearcoatRoughness;\n#endif\n#ifdef USE_SHEEN\n    uniform vec3 sheen;\n#endif\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n    varying vec3 vNormal;\n    #ifdef USE_TANGENT\n        varying vec3 vTangent;\n        varying vec3 vBitangent;\n    #endif\n#endif\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <bsdfs>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <lights_physical_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n    #include <clipping_planes_fragment>\n    vec4 diffuseColor = vec4( diffuse, opacity );\n    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n    vec3 totalEmissiveRadiance = emissive;\n    #include <logdepthbuf_fragment>\n    #include <map_fragment>\n    #include <color_fragment>\n    #include <alphamap_fragment>\n    #include <alphatest_fragment>\n    #include <roughnessmap_fragment>\n    #include <metalnessmap_fragment>\n    #include <normal_fragment_begin>\n    #include <normal_fragment_maps>\n    #include <clearcoat_normal_fragment_begin>\n    #include <clearcoat_normal_fragment_maps>\n    #include <emissivemap_fragment>\n    #include <lights_physical_fragment>\n    #include <lights_fragment_begin>\n    #include <lights_fragment_maps>\n    #include <lights_fragment_end>\n    #include <aomap_fragment>\n    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n    #ifdef TRANSPARENCY\n        diffuseColor.a *= saturate( 1. - transparency + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) );\n    #endif\n    gl_FragColor = vec4( outgoingLight,1.-(((0.2125 * outgoingLight.r) + (0.7154 * outgoingLight.g) + (0.0721 * outgoingLight.b)) ) );\n    #include <tonemapping_fragment>\n    #include <encodings_fragment>\n    #include <fog_fragment>\n    #include <premultiplied_alpha_fragment>\n    #include <dithering_fragment>\n}",roughness:0,metalness:1}),function(){T=new m.db,C=[];new m.f(20,20,20),new m.K({color:16746547})}(),c,y(),s=new _.a(r);var a=new v.a(h.a);s.addPass(a),E()}function x(){return c}function A(){return f}function b(n,e,i,t){d.load("./"+n,n=>{let r;n.scene.rotation.x=Math.PI/2,n.scene.traverse((function(n){n instanceof m.I&&(r=n,i||(n.material=t?new m.K({color:t,metalness:0,roughness:1}):S,n.material.needsUpdate=!0))}));n.scene.children[0];if(r){var a=n.animations;if(a&&a.length){l=new m.c(r);for(var o=0;o<a.length;o++){var d=a[o];action=l.clipAction(d),action.timeScale=.002,action.play()}}}e(n.scene)},n=>{console.log(n.loaded/n.total*100+"% loaded")},n=>{console.error("An error happened",n)})}function y(){window.screen.width>window.innerWidth?(a=window.innerWidth,o=window.innerHeight):(a=window.screen.width,o=window.screen.height),t.aspect=a/o,t.updateProjectionMatrix(),r.setPixelRatio(.5),r.setSize(a,o)}function E(n){N&&N.animate(),r.render(P(),t),requestAnimationFrame(E)}function L(){r.render(P(),t),function(n){let e=document.querySelector("#afterImage");e&&e.setAttribute("src",n)}(r.domElement.toDataURL())}var S,T,C;function R(n){z=n}var N,z=0;function P(){let n=z,e=C[n];if(null==e){e=T,C[n]="pend";let i=u[n];i?(g.pendApp(n),i(e=>{C[n]=[e.init(n,()=>{g.clearPendApp(n)}),e]})):C[n]=[T,void 0]}else"pend"==e?e=T:(N=e[1],e=e[0]);return e}}}]);