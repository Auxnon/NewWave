(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["App2Punk"],{

/***/ "./src/App2Punk.js":
/*!*************************!*\
  !*** ./src/App2Punk.js ***!
  \*************************/
/*! exports provided: init, animate, deinit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"animate\", function() { return animate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deinit\", function() { return deinit; });\n/* harmony import */ var _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/three.module.js */ \"./src/lib/three.module.js\");\n/* harmony import */ var _Render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Render.js */ \"./src/Render.js\");\n\r\n\r\n\r\nfunction init(n) {\r\n\tlet scene= new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Scene\"]();\r\n\r\n      var ambientLight = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"AmbientLight\"]( 0xffffff ); // soft white light\r\n      scene.add( ambientLight );\r\n      var sunLight = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"DirectionalLight\"]( 0xffffff, 0.6); //DirectionalLight\r\n      sunLight.position.set(0,1,0);\r\n      sunLight.castShadow = true;\r\n      scene.add( sunLight );\r\n      var sunTarget=new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__[\"Object3D\"]();\r\n      sunTarget.position.set(-20,0,-20);\r\n      scene.add( sunTarget );\r\n      sunLight.target=sunTarget;\r\n\r\n\r\n      _Render_js__WEBPACK_IMPORTED_MODULE_1__[\"loadModel\"]('assets/skull.glb',function(m){\r\n        m.position.set(0,0,0)\r\n         m.scale.set(10,10,10)\r\n         m.rotation.y=-Math.PI/2 //pi2 to pi\r\n        scene.add(m);\r\n      })\r\n\r\n\treturn scene\r\n}\r\n\r\nfunction animate(){\r\n\r\n}\r\n\r\nfunction deinit(){\r\n\r\n}\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/App2Punk.js?");

/***/ })

}]);