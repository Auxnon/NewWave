(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["App1SkyIsland"],{

/***/ "./src/App1SkyIsland.js":
/*!******************************!*\
  !*** ./src/App1SkyIsland.js ***!
  \******************************/
/*! exports provided: init, animate, deinit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"animate\", function() { return animate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deinit\", function() { return deinit; });\n/* harmony import */ var _Render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Render.js */ \"./src/Render.js\");\n\r\n\r\nlet greenModel;\r\n\r\nfunction init(n,THREE) {\r\n\tlet scene=new THREE.Scene();\r\n\r\n    _Render_js__WEBPACK_IMPORTED_MODULE_0__[\"loadModel\"]('assets/island.glb',function(m){\r\n      greenModel=m;\r\n      greenModel.position.set(0,260,-40)\r\n      greenModel.scale.set(10,10,10)\r\n      scene.add(greenModel);\r\n    })\r\n/*\r\n    Render.loadModel('assets/tree.gltf',function(m){\r\n       //m.scale.set(10,10,10)\r\n       // m.position.set(0,160,-40)\r\n       greenModel.add(m);\r\n    })*/\r\n    {\r\n       var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light\r\n      scene.add( ambientLight );\r\n      var sunLight = new THREE.DirectionalLight( 0xffffff, 1 ); //DirectionalLight\r\n      sunLight.position.set(0,1,0);\r\n      sunLight.castShadow = true;\r\n      scene.add( sunLight );\r\n      var sunTarget=new THREE.Object3D();\r\n      sunTarget.position.set(-20,0,-20);\r\n      scene.add( sunTarget );\r\n      sunLight.target=sunTarget;\r\n    }\r\n\r\n\r\n\tconsole.log(n+' loaded')\r\n\treturn scene;\r\n}\r\n\r\nvar value=0;\r\nvar dir=1;\r\nfunction animate(){\r\n\tif(greenModel){\r\n      value+=0.0005*dir\r\n      if(value>1 || value<0){\r\n        dir=-dir\r\n      }\r\n      greenModel.rotation.y=5.4+value*0.6//5.2 - 6\r\n      //m.position.set(0,260,-40)\r\n      greenModel.position.set(30-30*value,-80 +340*value,20 -60*value)\r\n     // x: 30, y: -80, z: 20\r\n      //console.log(greenModel.rotation.y)\r\n    }\r\n}\r\n\r\nfunction deinit(){\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack:///./src/App1SkyIsland.js?");

/***/ })

}]);