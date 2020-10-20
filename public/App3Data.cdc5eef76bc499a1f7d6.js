(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["App3Data"],{

/***/ "./src/App3Data.js":
/*!*************************!*\
  !*** ./src/App3Data.js ***!
  \*************************/
/*! exports provided: init, animate, deinit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"animate\", function() { return animate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deinit\", function() { return deinit; });\n/* harmony import */ var _Render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Render.js */ \"./src/Render.js\");\n\r\n\r\nvar shapes;\r\nvar THREE;\r\n\r\nfunction init(name, THREEi) {\r\n\tTHREE=THREEi\r\n    let scene = new THREE.Scene();\r\n    var ambientLight = new THREE.AmbientLight(0xffffff); // soft white light\r\n    scene.add(ambientLight);\r\n    var sunLight = new THREE.DirectionalLight(0xffffff, 0.6); //DirectionalLight\r\n    sunLight.position.set(0, 1, 0);\r\n    sunLight.castShadow = true;\r\n    scene.add(sunLight);\r\n    var sunTarget = new THREE.Object3D();\r\n    sunTarget.position.set(-20, 0, -20);\r\n    scene.add(sunTarget);\r\n    sunLight.target = sunTarget;\r\n\r\n    shapes = [];\r\n    let cubeGeometry = new THREE.BoxBufferGeometry(20, 20, 40);\r\n    let cubeMaterial = _Render_js__WEBPACK_IMPORTED_MODULE_0__[\"specterMaterial\"]; //new THREE.MeshBasicMaterial( { color:0xD53229 } )\r\n\r\n    let cubeO = new THREE.Mesh(cubeGeometry, cubeMaterial);\r\n    cubeO.position.set(-40, 0, 0);\r\n    shapes.push(cubeO)\r\n    scene.add(cubeO);\r\n    _Render_js__WEBPACK_IMPORTED_MODULE_0__[\"specterMaterial\"].color = 0xD53229;\r\n    var pyramid = new THREE.Mesh(new THREE.ConeGeometry(20, 20, 4), new THREE.MeshStandardMaterial({ color: 0xD53229 }));\r\n    pyramid.position.set(40, 0, 0);\r\n    shapes.push(pyramid)\r\n    scene.add(pyramid);\r\n\r\n    barGraph([70.114, 69.14, 69.14, 68.653, 68.653, 69.14, 68.653, 69.627, 69.627, 68.653, 69.627, 69.14, 69.14, 68.653, 70.114, 69.14, 69.14, 69.14, 68.653, 69.14], scene);\r\n    return scene;\r\n}\r\n\r\nfunction animate() {\r\n    shapes.forEach(c => {\r\n        c.rotation.x = Math.PI / 2\r\n        c.rotation.y += 0.02;\r\n    })\r\n}\r\n\r\nfunction deinit() {\r\n\r\n}\r\n\r\n\r\nfunction barGraph(data, scene) {\r\n    /* let cubeO=new THREE.Mesh(cubeGeometry,cubeMaterial);\r\n         cubeO.position.set(-40,0,0);\r\n         shapesTwo.push(cubeO)\r\n         scenes[1].add(cubeO);\r\n         Render.specterMaterial.color=0xD53229;*/\r\n\r\n    let factor = 80 / data.length\r\n    let geo = new THREE.BoxBufferGeometry(factor / 2, 10, 15)\r\n    let s = 0xFFD631;\r\n    let e = 0xD53229;\r\n\r\n\r\n\r\n    for(let i = 0; i < data.length; i++) {\r\n        let val = data[i]\r\n        let scale = (72 - val) / 3\r\n        let color = ((e - s) * scale) + s\r\n        console.log(scale)\r\n\r\n        let cube = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: color }));\r\n        cube.position.set(-40 + i * factor, 0, 10)\r\n        cube.scale.set(1, 1, scale)\r\n        scene.add(cube)\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack:///./src/App3Data.js?");

/***/ })

}]);