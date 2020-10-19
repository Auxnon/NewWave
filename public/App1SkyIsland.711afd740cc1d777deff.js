(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["App1SkyIsland"],{

/***/ "./src/App1SkyIsland.js":
/*!******************************!*\
  !*** ./src/App1SkyIsland.js ***!
  \******************************/
/*! exports provided: init, animate, deinit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"animate\", function() { return animate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deinit\", function() { return deinit; });\n/* harmony import */ var _Render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Render.js */ \"./src/Render.js\");\n\n\nlet greenModel;\n\nfunction init(n,THREE) {\n\tlet scene=new THREE.Scene();\n\n    _Render_js__WEBPACK_IMPORTED_MODULE_0__[\"loadModel\"]('assets/island.glb',function(m){\n      greenModel=m;\n      greenModel.position.set(0,260,-40)\n      greenModel.scale.set(10,10,10)\n      scene.add(greenModel);\n    })\n/*\n    Render.loadModel('assets/tree.gltf',function(m){\n       //m.scale.set(10,10,10)\n       // m.position.set(0,160,-40)\n       greenModel.add(m);\n    })*/\n    {\n       var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light\n      scene.add( ambientLight );\n      var sunLight = new THREE.DirectionalLight( 0xffffff, 1 ); //DirectionalLight\n      sunLight.position.set(0,1,0);\n      sunLight.castShadow = true;\n      scene.add( sunLight );\n      var sunTarget=new THREE.Object3D();\n      sunTarget.position.set(-20,0,-20);\n      scene.add( sunTarget );\n      sunLight.target=sunTarget;\n    }\n\n\n\tconsole.log(n+' loaded')\n\treturn scene;\n}\n\nvar value=0;\nvar dir=1;\nfunction animate(){\n\tif(greenModel){\n      value+=0.0005*dir\n      if(value>1 || value<0){\n        dir=-dir\n      }\n      greenModel.rotation.y=5.4+value*0.6//5.2 - 6\n      //m.position.set(0,260,-40)\n      greenModel.position.set(30-30*value,-80 +340*value,20 -60*value)\n     // x: 30, y: -80, z: 20\n      //console.log(greenModel.rotation.y)\n    }\n}\n\nfunction deinit(){\n\n}\n\n\n\n//# sourceURL=webpack:///./src/App1SkyIsland.js?");

/***/ })

}]);