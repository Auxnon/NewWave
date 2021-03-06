(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["App2Punk"],{

/***/ "./src/App2Punk.js":
/*!*************************!*\
  !*** ./src/App2Punk.js ***!
  \*************************/
/*! exports provided: init, animate, deinit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"animate\", function() { return animate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deinit\", function() { return deinit; });\n/* harmony import */ var _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/three.module.js */ \"./src/lib/three.module.js\");\n/* harmony import */ var _Render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Render.js */ \"./src/Render.js\");\n\r\n\r\n\r\nvar skull;\r\nvar aniFactor = 0;\r\nconst speed=20\r\nvar dir = speed;\r\n\r\nvar group\r\nfunction init(index,dom, complete) {\r\n    let scene = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Scene\"]();\r\n\r\n    var ambientLight = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"AmbientLight\"](0xffffff); // soft white light\r\n    scene.add(ambientLight);\r\n    var sunLight = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"DirectionalLight\"](0xffffff, 0.6); //DirectionalLight\r\n    sunLight.position.set(0, 1, 0);\r\n    sunLight.castShadow = true;\r\n    scene.add(sunLight);\r\n    var sunTarget = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Object3D\"]();\r\n    sunTarget.position.set(-20, 0, -20);\r\n    scene.add(sunTarget);\r\n    sunLight.target = sunTarget;\r\n\r\n\r\n    _Render_js__WEBPACK_IMPORTED_MODULE_1__[\"loadModel\"]('assets/skull.glb', function(m) {\r\n        skull = m;\r\n        m.position.set(0, 160, 70)\r\n        m.scale.set(6, 6, 6)\r\n        m.rotation.y = -Math.PI / 2 //pi2 to pi\r\n        scene.add(m);\r\n        complete();\r\n        window.skull=skull\r\n    })\r\n    group= new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Group\"]();\r\n\r\n    let mats=[new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"MeshStandardMaterial\"]({ color: 0x6E2E6F }),new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"MeshStandardMaterial\"]({ color: 0x432E6F }),new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"MeshStandardMaterial\"]({ color: 0x142A7D })]\r\n    for(let j=0;j<5;j++){\r\n      if(j!=2)\r\n        for(let i=0;i<16;i++){\r\n          let high=20+Math.random()*68\r\n          let cube = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"](new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"BoxBufferGeometry\"](26, 26, high),mats[Math.floor(Math.random()*3)]);\r\n          cube.position.set((j-2)*40,-60+i*40,-20+high/2)\r\n          group.add(cube)\r\n        }\r\n    }\r\n    scene.add(group)\r\n   \r\n    //let geo = new THREE.BoxBufferGeometry(factor / 2, 10, 15)\r\n    //let cube = new THREE.Mesh(geo, );\r\n    return scene\r\n}\r\n\r\nfunction animate(delta) {\r\n    if(skull) {\r\n        aniFactor += dir*delta;\r\n        if(aniFactor > 100) {\r\n            dir = -speed\r\n            aniFactor = 100\r\n        } else if(aniFactor < 0) {\r\n            dir = speed\r\n            aniFactor = 0\r\n        }\r\n        skull.children[1].rotation.z=-0.6*(aniFactor%10)/10.0\r\n\r\n        skull.rotation.y = Math.PI + (Math.PI * aniFactor / 100.0)\r\n        skull.rotation.z = (-Math.PI / 8) * (50 - Math.abs(aniFactor - 50)) / 50\r\n\r\n        group.rotation.x=-Math.PI/8 +(aniFactor/100.0)*Math.PI/16\r\n    }\r\n\r\n}\r\n\r\nfunction deinit() {\r\n\r\n}\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/App2Punk.js?");

/***/ }),

/***/ "./src/Render.js":
/*!***********************!*\
  !*** ./src/Render.js ***!
  \***********************/
/*! exports provided: init, getAlphaCanvas, getBetaCanvas, bufferPrint, loadModel, flipScene, specterMaterial, resize */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected token (609:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n|     if(scene != undefined && scene != 'pend' && scene.open) \\n| \\n> }\\n| var activeScene = 0;\\n| var activeModule;\");\n\n//# sourceURL=webpack:///./src/Render.js?");

/***/ })

}]);