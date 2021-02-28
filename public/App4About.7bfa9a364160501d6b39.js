(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["App4About"],{

/***/ "./src/App4About.js":
/*!**************************!*\
  !*** ./src/App4About.js ***!
  \**************************/
/*! exports provided: init, animate, deinit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"animate\", function() { return animate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deinit\", function() { return deinit; });\n/* harmony import */ var _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/three.module.js */ \"./src/lib/three.module.js\");\n/* harmony import */ var _Render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Render.js */ \"./src/Render.js\");\n\n\n\n//pass in name, and a pointer to a complete function which dictates everything has loaded, \n//we keep track inside the mini class by counting  resources and incrementing till count is complete then, complte()\n//animate is called every render, deint... not used yet\n\nlet portrait;\nfunction init(index,dom,complete) {\n\tlet scene=new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Scene\"]();\n\tvar ambientLight = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"AmbientLight\"](0xffffff); // soft white light\n    scene.add(ambientLight);\n    var sunLight = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"DirectionalLight\"](0xffffff, 0.6); //DirectionalLight\n    sunLight.position.set(-1, -1, -1);\n    scene.add(sunLight);\n\t_Render_js__WEBPACK_IMPORTED_MODULE_1__[\"loadModel\"]('assets/portrait.glb', function(m) {\n        portrait = m;\n        m.position.set(0, 0, 0)\n        m.scale.set(20, 20, 20)\n        //m.rotation.y = -Math.PI / 2 //pi2 to pi\n        scene.add(m);\n        complete();\n    })\n    return scene;\n}\n\nfunction animate(delta){\n\n}\n\nfunction deinit(){\n\n}\n\n\n\n//# sourceURL=webpack:///./src/App4About.js?");

/***/ })

}]);