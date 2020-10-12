/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Main.js":
/*!*********************!*\
  !*** ./src/Main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Render.js */ \"./src/Render.js\");\n\r\n\r\nfunction init(){\r\n\t_Render_js__WEBPACK_IMPORTED_MODULE_0__[\"init\"]();\r\n\r\n\r\n\r\n\r\n\tvar toggle=false;\r\n\r\n\tvar opened=document.querySelector('#seg3');\r\n\r\n\r\n\r\n\r\n\tdocument.querySelectorAll(\".column\").forEach((c,i)=>{\r\n\t\tc.addEventListener('mouseover',ev=>{\r\n\t\t\tif(!c.children.length){\r\n\t\t\t\t/*var e = ev.toElement || ev.relatedTarget;\r\n\t\t        if (e.parentNode == this || e == this) {\r\n\t\t           return;\r\n\t\t        }*/\r\n\r\n\r\n\t\t\t\t\r\n\r\n\r\n\t\t\t\t\r\n\r\n\t\t\t\t/*if(d.reserved)\r\n\t\t\t\t\td.remove();\r\n\r\n\t\t\t\t\r\n\t\t\t\tc.appendChild(d);*/\r\n\r\n\t\t\t\t/*setTimeout(()=>{\r\n\t\t\t\t\t//d.style.opacity=1;\r\n\t\t\t\t},10);*/\r\n\r\n\t\t\t}\r\n\t\t\tif(opened!=c){\r\n\t\t\t\tlet d=_Render_js__WEBPACK_IMPORTED_MODULE_0__[\"getAlphaCanvas\"]();\r\n\t\t\t\td.style.opacity=1;\r\n\t\t\t\td.remove();\r\n\t\t\t\tlet afterImage=document.querySelector('#afterImage');\r\n\t\t\t\tafterImage.remove();\r\n\r\n\t\t\t\tc.appendChild(d);\r\n\t\t\t\t\t\r\n\t\t\t\topened.appendChild(afterImage);\r\n\t\t\t\tafterImage.style.opacity=1;\r\n\t\t\t\tsetTimeout(()=>{afterImage.style.opacity=0;},1);\r\n\t\t\t\topened.classList.remove('openedColumn');\r\n\t\t\t\t_Render_js__WEBPACK_IMPORTED_MODULE_0__[\"bufferPrint\"]();\r\n\t\t\t\topened=c;\r\n\t\t\t\t//if(i<4)\r\n\t\t\t\topened.classList.add('openedColumn');\r\n\r\n\t\t\t\tSceneManager.flipScene(i);\r\n\r\n\t\t\t\tlet mainTitle=document.querySelector('#mainTitle');\r\n\t\t\t\tif(mainTitle)\r\n\t\t\t\t\tmainTitle.style.left=window.innerWidth*(0.38 + i*0.06)+'px' //half 76% + offset of tabs\r\n\t\t\t}\r\n\t\t});\r\n\r\n\t\tc.addEventListener('mouseout',ev=>{\r\n\t\t\tif(c.children.length){\r\n\t\t\t\t//c.firstChild.style.opacity=0;\r\n\t\t\t\t//setTimeout(()=>{c.firstChild.remove()},1000)\r\n\t\t\t}\r\n\t\t})\r\n\t})\r\n\r\n}init();\n\n//# sourceURL=webpack:///./src/Main.js?");

/***/ }),

/***/ "./src/Render.js":
/*!***********************!*\
  !*** ./src/Render.js ***!
  \***********************/
/*! exports provided: init, getAlphaCanvas, getBetaCanvas, flipScene, bufferPrint, loadModel, specterMaterial */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Export 'flipScene' is not defined (653:42)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n| \\n| \\n> export {init,getAlphaCanvas,getBetaCanvas,flipScene,bufferPrint,loadModel,specterMaterial}\\n| \");\n\n//# sourceURL=webpack:///./src/Render.js?");

/***/ })

/******/ });