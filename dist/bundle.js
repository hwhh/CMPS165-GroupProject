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
/******/ 	return __webpack_require__(__webpack_require__.s = "./scripts/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./scripts/index.js":
/*!**************************!*\
  !*** ./scripts/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.svg = undefined;\nexports.toggle_lineChart_visibility = toggle_lineChart_visibility;\n\nvar _map = __webpack_require__(/*! ./map */ \"./scripts/map.js\");\n\nvar _variables = __webpack_require__(/*! ./variables */ \"./scripts/variables.js\");\n\nvar total_internal_water = new Map();\nvar total_external_water = new Map();\nvar total_available_water = new Map();\nvar total_water_used = new Map();\nvar water_stress_levels = new Map();\n\nvar svg = exports.svg = d3.select(\"body\").append(\"svg\").attr('width', _variables.width).attr('height', _variables.height + 50);\n\nfunction toggle_lineChart_visibility() {\n    d3.select('svg').select('#map').transition().duration(1000).style('display', 'none');\n    d3.select('svg').select('#slider').transition().duration(1000).style('display', 'none');\n    lineGraph_group.attr('visibility', 'visibile');\n}\n\nfunction loadDataset(map, file, func) {\n    return new Promise(function (resolve, reject) {\n        d3.csv(file, function (data) {\n            data.forEach(function (d) {\n                var values = {};\n                Object.keys(d).forEach(function (key) {\n                    if (key !== 'Year') {\n                        values[key] = func(+d[key]);\n                    }\n                });\n                map.set(d.Year, values);\n            });\n            resolve();\n        });\n    });\n}\n\nPromise.all([loadDataset(water_stress_levels, './Data/water_stress_levels.csv', function (val) {\n    return val / 100 * 5;\n}), loadDataset(total_external_water, './Data/external_water.csv', function (val) {\n    return val;\n}), loadDataset(total_internal_water, './Data/internal_water.csv', function (val) {\n    return val;\n}), loadDataset(total_water_used, './Data/water_withdraws.csv', function (val) {\n    return val;\n})]).then(function (values) {\n    (0, _map.renderMap)();\n    // lineChart();\n    // createSlider();\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL2luZGV4LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NjcmlwdHMvaW5kZXguanM/NDMwNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3JlbmRlck1hcH0gZnJvbSBcIi4vbWFwXCI7XG5pbXBvcnQge3dpZHRoLCBoZWlnaHR9IGZyb20gXCIuL3ZhcmlhYmxlc1wiO1xuXG5sZXQgdG90YWxfaW50ZXJuYWxfd2F0ZXIgPSBuZXcgTWFwKCk7XG5sZXQgdG90YWxfZXh0ZXJuYWxfd2F0ZXIgPSBuZXcgTWFwKCk7XG5sZXQgdG90YWxfYXZhaWxhYmxlX3dhdGVyID0gbmV3IE1hcCgpO1xubGV0IHRvdGFsX3dhdGVyX3VzZWQgPSBuZXcgTWFwKCk7XG5sZXQgd2F0ZXJfc3RyZXNzX2xldmVscyA9IG5ldyBNYXAoKTtcblxuZXhwb3J0IGNvbnN0IHN2ZyA9IGQzLnNlbGVjdChcImJvZHlcIikuYXBwZW5kKFwic3ZnXCIpXG4gICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodCArIDUwKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZV9saW5lQ2hhcnRfdmlzaWJpbGl0eSgpIHtcbiAgICBkMy5zZWxlY3QoJ3N2ZycpLnNlbGVjdCgnI21hcCcpLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5zdHlsZSgnZGlzcGxheScsICdub25lJyk7XG4gICAgZDMuc2VsZWN0KCdzdmcnKS5zZWxlY3QoJyNzbGlkZXInKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMCkuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIGxpbmVHcmFwaF9ncm91cC5hdHRyKCd2aXNpYmlsaXR5JywgJ3Zpc2liaWxlJyk7XG59XG5cblxuZnVuY3Rpb24gbG9hZERhdGFzZXQobWFwLCBmaWxlLCBmdW5jKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZDMuY3N2KGZpbGUsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0ge307XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgIT09ICdZZWFyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2tleV0gPSBmdW5jKCtkW2tleV0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtYXAuc2V0KGQuWWVhciwgdmFsdWVzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5Qcm9taXNlLmFsbChbXG4gICAgbG9hZERhdGFzZXQod2F0ZXJfc3RyZXNzX2xldmVscywgJy4vRGF0YS93YXRlcl9zdHJlc3NfbGV2ZWxzLmNzdicsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgcmV0dXJuICgodmFsIC8gMTAwKSAqIDUpXG4gICAgfSksXG4gICAgbG9hZERhdGFzZXQodG90YWxfZXh0ZXJuYWxfd2F0ZXIsICcuL0RhdGEvZXh0ZXJuYWxfd2F0ZXIuY3N2JywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsXG4gICAgfSksXG4gICAgbG9hZERhdGFzZXQodG90YWxfaW50ZXJuYWxfd2F0ZXIsICcuL0RhdGEvaW50ZXJuYWxfd2F0ZXIuY3N2JywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsXG4gICAgfSksXG4gICAgbG9hZERhdGFzZXQodG90YWxfd2F0ZXJfdXNlZCwgJy4vRGF0YS93YXRlcl93aXRoZHJhd3MuY3N2JywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsXG4gICAgfSksXG5dKS50aGVuKHZhbHVlcyA9PiB7XG4gICAgcmVuZGVyTWFwKCk7XG4gICAgLy8gbGluZUNoYXJ0KCk7XG4gICAgLy8gY3JlYXRlU2xpZGVyKCk7XG59KTtcblxuXG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQWFBO0FBQ0E7QUFkQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./scripts/index.js\n");

/***/ }),

/***/ "./scripts/map.js":
/*!************************!*\
  !*** ./scripts/map.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.color = exports.path = exports.projection = undefined;\nexports.renderMap = renderMap;\n\nvar _index = __webpack_require__(/*! ./index */ \"./scripts/index.js\");\n\nvar utils = _interopRequireWildcard(_index);\n\nvar _variables = __webpack_require__(/*! ./variables */ \"./scripts/variables.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nvar projection = exports.projection = d3.geoMiller().scale(150).translate([_variables.width / 2, _variables.height / 1.8]);\n\nvar path = exports.path = d3.geoPath().projection(projection);\n\nvar color = exports.color = d3.scaleThreshold().domain([1, 2, 3, 4, 5, 6, 7, 8, 9]).range(d3.schemeReds[7]);\n\nfunction renderMap(data) {\n    d3.json('./Data/countries.geojson', function (error, mapData) {\n        var features = mapData.features;\n        utils.svg.append('g').attr('id', 'map').attr('class', 'countries').style('display', 'block').selectAll('path').data(features).enter().append('path').attr('d', path).style('fill', function (d) {\n            // return color(data.get());\n            return color(Math.floor(Math.random() * 10) + 1);\n        }).on(\"mouseover\", function (d) {\n            var country_name = d.properties.ADMIN;\n            //console.log(country_name);\n\n            //defines the color change on hover\n            d3.select(this).style(\"fill\", \"orange\");\n        }).on(\"mouseout\", function (d) {\n            d3.select(this).style(\"fill\", function (d) {\n                var country_name = d.properties.ADMIN;\n                //console.log(country_name);\n                return color(Math.floor(Math.random() * 10) + 1);\n            });\n        }).on(\"click\", function (d) {\n            var country_name = d.properties.ADMIN;\n            console.log(\"clicked: \" + country_name);\n            utils.toggle_lineChart_visibility();\n        });\n    });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL21hcC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zY3JpcHRzL21hcC5qcz82ZDIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQge3dpZHRoLCBoZWlnaHR9IGZyb20gXCIuL3ZhcmlhYmxlc1wiO1xuXG5cbmV4cG9ydCBjb25zdCBwcm9qZWN0aW9uID0gZDMuZ2VvTWlsbGVyKClcbiAgICAuc2NhbGUoMTUwKVxuICAgIC50cmFuc2xhdGUoW3dpZHRoIC8gMiwgaGVpZ2h0IC8gMS44XSk7XG5cbmV4cG9ydCBjb25zdCBwYXRoID0gZDMuZ2VvUGF0aCgpXG4gICAgLnByb2plY3Rpb24ocHJvamVjdGlvbik7XG5cbmV4cG9ydCBjb25zdCBjb2xvciA9IGQzLnNjYWxlVGhyZXNob2xkKClcbiAgICAuZG9tYWluKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XSlcbiAgICAucmFuZ2UoZDMuc2NoZW1lUmVkc1s3XSk7XG5cblxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTWFwKGRhdGEpIHtcbiAgICBkMy5qc29uKCcuL0RhdGEvY291bnRyaWVzLmdlb2pzb24nLCBmdW5jdGlvbiAoZXJyb3IsIG1hcERhdGEpIHtcbiAgICAgICAgY29uc3QgZmVhdHVyZXMgPSBtYXBEYXRhLmZlYXR1cmVzO1xuICAgICAgICB1dGlscy5zdmcuYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5hdHRyKCdpZCcsICdtYXAnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvdW50cmllcycpXG4gICAgICAgICAgICAuc3R5bGUoJ2Rpc3BsYXknLCAnYmxvY2snKVxuICAgICAgICAgICAgLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgICAgICAgICAuZGF0YShmZWF0dXJlcylcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAuYXR0cignZCcsIHBhdGgpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBjb2xvcihkYXRhLmdldCgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sb3IoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvdW50cnlfbmFtZSA9IGQucHJvcGVydGllcy5BRE1JTjtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGNvdW50cnlfbmFtZSk7XG5cbiAgICAgICAgICAgICAgICAvL2RlZmluZXMgdGhlIGNvbG9yIGNoYW5nZSBvbiBob3ZlclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwib3JhbmdlXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnRyeV9uYW1lID0gZC5wcm9wZXJ0aWVzLkFETUlOO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGNvdW50cnlfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIGxldCBjb3VudHJ5X25hbWUgPSBkLnByb3BlcnRpZXMuQURNSU47XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjbGlja2VkOiBcIiArIGNvdW50cnlfbmFtZSk7XG4gICAgICAgICAgICAgICAgdXRpbHMudG9nZ2xlX2xpbmVDaGFydF92aXNpYmlsaXR5KCk7XG4gICAgICAgICAgICB9KVxuXG4gICAgfSk7XG59XG5cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBaUJBO0FBQ0E7QUFsQkE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBOzs7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQVNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./scripts/map.js\n");

/***/ }),

/***/ "./scripts/variables.js":
/*!******************************!*\
  !*** ./scripts/variables.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar width = exports.width = 1200,\n    height = exports.height = 600;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL3ZhcmlhYmxlcy5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zY3JpcHRzL3ZhcmlhYmxlcy5qcz8wMjFlIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCB3aWR0aCA9IDEyMDAsIGhlaWdodCA9IDYwMDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./scripts/variables.js\n");

/***/ })

/******/ });