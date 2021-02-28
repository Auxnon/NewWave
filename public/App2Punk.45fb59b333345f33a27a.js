(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["App2Punk"],{

/***/ "./src/App2Punk.js":
/*!*************************!*\
  !*** ./src/App2Punk.js ***!
  \*************************/
/*! exports provided: init, animate, deinit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"animate\", function() { return animate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deinit\", function() { return deinit; });\n/* harmony import */ var _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/three.module.js */ \"./src/lib/three.module.js\");\n/* harmony import */ var _Render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Render.js */ \"./src/Render.js\");\n\n\n\nvar skull;\nvar aniFactor = 0;\nconst speed=20\nvar dir = speed;\n\nvar group\nfunction init(index,dom, complete) {\n    let scene = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Scene\"]();\n\n    var ambientLight = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"AmbientLight\"](0xffffff); // soft white light\n    scene.add(ambientLight);\n    var sunLight = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"DirectionalLight\"](0xffffff, 0.6); //DirectionalLight\n    sunLight.position.set(0, 1, 0);\n    sunLight.castShadow = true;\n    scene.add(sunLight);\n    var sunTarget = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Object3D\"]();\n    sunTarget.position.set(-20, 0, -20);\n    scene.add(sunTarget);\n    sunLight.target = sunTarget;\n\n\n    _Render_js__WEBPACK_IMPORTED_MODULE_1__[\"loadModel\"]('assets/skull.glb', function(m) {\n        skull = m;\n        m.position.set(0, 160, 70)\n        m.scale.set(6, 6, 6)\n        m.rotation.y = -Math.PI / 2 //pi2 to pi\n        scene.add(m);\n        complete();\n        window.skull=skull\n    })\n    group= new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Group\"]();\n\n    let mats=[new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"MeshStandardMaterial\"]({ color: 0x6E2E6F }),new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"MeshStandardMaterial\"]({ color: 0x432E6F }),new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"MeshStandardMaterial\"]({ color: 0x142A7D })]\n    for(let j=0;j<5;j++){\n      if(j!=2)\n        for(let i=0;i<16;i++){\n          let high=20+Math.random()*68\n          let cube = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"](new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"BoxBufferGeometry\"](26, 26, high),mats[Math.floor(Math.random()*3)]);\n          cube.position.set((j-2)*40,-60+i*40,-20+high/2)\n          group.add(cube)\n        }\n    }\n    scene.add(group)\n   \n    //let geo = new THREE.BoxBufferGeometry(factor / 2, 10, 15)\n    //let cube = new THREE.Mesh(geo, );\n    return scene\n}\n\nfunction animate(delta) {\n    if(skull) {\n        aniFactor += dir*delta;\n        if(aniFactor > 100) {\n            dir = -speed\n            aniFactor = 100\n        } else if(aniFactor < 0) {\n            dir = speed\n            aniFactor = 0\n        }\n        skull.children[1].rotation.z=-0.6*(aniFactor%10)/10.0\n\n        skull.rotation.y = Math.PI + (Math.PI * aniFactor / 100.0)\n        skull.rotation.z = (-Math.PI / 8) * (50 - Math.abs(aniFactor - 50)) / 50\n\n        group.rotation.x=-Math.PI/8 +(aniFactor/100.0)*Math.PI/16\n    }\n\n}\n\nfunction deinit() {\n\n}\n\n\n\n\n\n\n//# sourceURL=webpack:///./src/App2Punk.js?");

/***/ })

}]);