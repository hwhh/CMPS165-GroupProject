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
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.svg = undefined;\n\nvar _map = __webpack_require__(/*! ./map */ \"./scripts/map.js\");\n\nvar _variables = __webpack_require__(/*! ./variables */ \"./scripts/variables.js\");\n\nvar total_internal_water = new Map();\nvar total_external_water = new Map();\nvar total_available_water = new Map();\nvar total_water_used = new Map();\nvar water_stress_levels = new Map();\n\nvar svg = exports.svg = d3.select(\"body\").append(\"svg\").attr('width', _variables.width).attr('height', _variables.height + 50);\n\nfunction toggle_lineChart_visibility() {\n    d3.select('svg').select('#map').transition().duration(1000).style('display', 'none');\n    d3.select('svg').select('#slider').transition().duration(1000).style('display', 'none');\n    lineGraph_group.attr('visibility', 'visibile');\n}\n\nfunction loadDataset(map, file, func) {\n    return new Promise(function (resolve, reject) {\n        d3.csv(file, function (data) {\n            data.forEach(function (d) {\n                var values = {};\n                Object.keys(d).forEach(function (key) {\n                    if (key !== 'Year') {\n                        values[key] = func(+d[key]);\n                    }\n                });\n                map.set(d.Year, values);\n            });\n            resolve();\n        });\n    });\n}\n\nPromise.all([loadDataset(water_stress_levels, './Data/water_stress_levels.csv', function (val) {\n    return val / 100 * 5;\n}), loadDataset(total_external_water, './Data/external_water.csv', function (val) {\n    return val;\n}), loadDataset(total_internal_water, './Data/internal_water.csv', function (val) {\n    return val;\n}), loadDataset(total_water_used, './Data/water_withdraws.csv', function (val) {\n    return val;\n})]).then(function (values) {\n    (0, _map.renderMap)();\n    // lineChart();\n    // createSlider();\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL2luZGV4LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NjcmlwdHMvaW5kZXguanM/NDMwNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3JlbmRlck1hcH0gZnJvbSBcIi4vbWFwXCI7XG5pbXBvcnQge3dpZHRoLCBoZWlnaHR9IGZyb20gXCIuL3ZhcmlhYmxlc1wiO1xuXG5sZXQgdG90YWxfaW50ZXJuYWxfd2F0ZXIgPSBuZXcgTWFwKCk7XG5sZXQgdG90YWxfZXh0ZXJuYWxfd2F0ZXIgPSBuZXcgTWFwKCk7XG5sZXQgdG90YWxfYXZhaWxhYmxlX3dhdGVyID0gbmV3IE1hcCgpO1xubGV0IHRvdGFsX3dhdGVyX3VzZWQgPSBuZXcgTWFwKCk7XG5sZXQgd2F0ZXJfc3RyZXNzX2xldmVscyA9IG5ldyBNYXAoKTtcblxuZXhwb3J0IGNvbnN0IHN2ZyA9IGQzLnNlbGVjdChcImJvZHlcIikuYXBwZW5kKFwic3ZnXCIpXG4gICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodCArIDUwKTtcblxuZnVuY3Rpb24gdG9nZ2xlX2xpbmVDaGFydF92aXNpYmlsaXR5KCkge1xuICAgIGQzLnNlbGVjdCgnc3ZnJykuc2VsZWN0KCcjbWFwJykudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICBkMy5zZWxlY3QoJ3N2ZycpLnNlbGVjdCgnI3NsaWRlcicpLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5zdHlsZSgnZGlzcGxheScsICdub25lJyk7XG4gICAgbGluZUdyYXBoX2dyb3VwLmF0dHIoJ3Zpc2liaWxpdHknLCAndmlzaWJpbGUnKTtcbn1cblxuXG5mdW5jdGlvbiBsb2FkRGF0YXNldChtYXAsIGZpbGUsIGZ1bmMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBkMy5jc3YoZmlsZSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSB7fTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhkKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSAhPT0gJ1llYXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNba2V5XSA9IGZ1bmMoK2Rba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1hcC5zZXQoZC5ZZWFyLCB2YWx1ZXMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cblByb21pc2UuYWxsKFtcbiAgICBsb2FkRGF0YXNldCh3YXRlcl9zdHJlc3NfbGV2ZWxzLCAnLi9EYXRhL3dhdGVyX3N0cmVzc19sZXZlbHMuY3N2JywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICByZXR1cm4gKCh2YWwgLyAxMDApICogNSlcbiAgICB9KSxcbiAgICBsb2FkRGF0YXNldCh0b3RhbF9leHRlcm5hbF93YXRlciwgJy4vRGF0YS9leHRlcm5hbF93YXRlci5jc3YnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHJldHVybiB2YWxcbiAgICB9KSxcbiAgICBsb2FkRGF0YXNldCh0b3RhbF9pbnRlcm5hbF93YXRlciwgJy4vRGF0YS9pbnRlcm5hbF93YXRlci5jc3YnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHJldHVybiB2YWxcbiAgICB9KSxcbiAgICBsb2FkRGF0YXNldCh0b3RhbF93YXRlcl91c2VkLCAnLi9EYXRhL3dhdGVyX3dpdGhkcmF3cy5jc3YnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHJldHVybiB2YWxcbiAgICB9KSxcbl0pLnRoZW4odmFsdWVzID0+IHtcbiAgICByZW5kZXJNYXAoKTtcbiAgICAvLyBsaW5lQ2hhcnQoKTtcbiAgICAvLyBjcmVhdGVTbGlkZXIoKTtcbn0pO1xuXG5cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./scripts/index.js\n");

/***/ }),

/***/ "./scripts/map.js":
/*!************************!*\
  !*** ./scripts/map.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.color = exports.path = exports.projection = undefined;\nexports.renderMap = renderMap;\n\nvar _index = __webpack_require__(/*! ./index */ \"./scripts/index.js\");\n\nvar utils = _interopRequireWildcard(_index);\n\nvar _variables = __webpack_require__(/*! ./variables */ \"./scripts/variables.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nvar projection = exports.projection = d3.geoMercator().scale(100).translate([_variables.width / 2, _variables.height / 2.5]);\n\nvar path = exports.path = d3.geoPath().projection(projection);\n\nvar color = exports.color = d3.scaleThreshold().domain([1, 2, 3, 4, 5, 6, 7, 8, 9]).range(d3.schemeBlues[7]);\n\nfunction renderMap(data) {\n    d3.json('./Data/world.geojson', function (error, mapData) {\n        var features = mapData.features;\n        utils.svg.append('g').attr('id', 'map').attr('class', 'countries').style('display', 'block').selectAll('path').data(features).enter().append('path').attr('d', path).style('fill', function (d) {\n            // return color(data.get());\n            return color(Math.floor(Math.random() * 10) + 1);\n        });\n        // .on(\"mouseover\", function (d) {\n        //     let country_name = d.properties.ADMIN;\n        //     //console.log(country_name);\n        //\n        //     //defines the color change on hover\n        //     d3.select(this)\n        //         .style(\"fill\", \"orange\");\n        // })\n        // .on(\"mouseout\", function (d) {\n        //     d3.select(this).style(\"fill\", function (d) {\n        //         let country_name = d.properties.ADMIN;\n        //         //console.log(country_name);\n        //         return color(Math.floor(Math.random() * 10) + 1);\n        //     });\n        // })\n        // .on(\"click\", function (d) {\n        //     let country_name = d.properties.ADMIN;\n        //     console.log(\"clicked: \" + country_name);\n        //     toggle_lineChart_visibility();\n        // })\n    });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL21hcC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zY3JpcHRzL21hcC5qcz82ZDIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQge3dpZHRoLCBoZWlnaHR9IGZyb20gXCIuL3ZhcmlhYmxlc1wiO1xuXG5cbmV4cG9ydCBjb25zdCBwcm9qZWN0aW9uID0gZDMuZ2VvTWVyY2F0b3IoKVxuICAgIC5zY2FsZSgxMDApXG4gICAgLnRyYW5zbGF0ZShbd2lkdGggLyAyLCBoZWlnaHQgLyAyLjVdKTtcblxuZXhwb3J0IGNvbnN0IHBhdGggPSBkMy5nZW9QYXRoKClcbiAgICAucHJvamVjdGlvbihwcm9qZWN0aW9uKTtcblxuZXhwb3J0IGNvbnN0IGNvbG9yID0gZDMuc2NhbGVUaHJlc2hvbGQoKVxuICAgIC5kb21haW4oWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldKVxuICAgIC5yYW5nZShkMy5zY2hlbWVCbHVlc1s3XSk7XG5cblxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTWFwKGRhdGEpIHtcbiAgICBkMy5qc29uKCcuL0RhdGEvd29ybGQuZ2VvanNvbicsIGZ1bmN0aW9uIChlcnJvciwgbWFwRGF0YSkge1xuICAgICAgICBjb25zdCBmZWF0dXJlcyA9IG1hcERhdGEuZmVhdHVyZXM7XG4gICAgICAgIHV0aWxzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmF0dHIoJ2lkJywgJ21hcCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY291bnRyaWVzJylcbiAgICAgICAgICAgIC5zdHlsZSgnZGlzcGxheScsICdibG9jaycpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgICAgICAgIC5kYXRhKGZlYXR1cmVzKVxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgIC5hdHRyKCdkJywgcGF0aClcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIGNvbG9yKGRhdGEuZ2V0KCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIC8vIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAvLyAgICAgbGV0IGNvdW50cnlfbmFtZSA9IGQucHJvcGVydGllcy5BRE1JTjtcbiAgICAgICAgLy8gICAgIC8vY29uc29sZS5sb2coY291bnRyeV9uYW1lKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgIC8vZGVmaW5lcyB0aGUgY29sb3IgY2hhbmdlIG9uIGhvdmVyXG4gICAgICAgIC8vICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgLy8gICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwib3JhbmdlXCIpO1xuICAgICAgICAvLyB9KVxuICAgICAgICAvLyAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAvLyAgICAgZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAvLyAgICAgICAgIGxldCBjb3VudHJ5X25hbWUgPSBkLnByb3BlcnRpZXMuQURNSU47XG4gICAgICAgIC8vICAgICAgICAgLy9jb25zb2xlLmxvZyhjb3VudHJ5X25hbWUpO1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiBjb2xvcihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxKTtcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9KVxuICAgICAgICAvLyAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAvLyAgICAgbGV0IGNvdW50cnlfbmFtZSA9IGQucHJvcGVydGllcy5BRE1JTjtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiY2xpY2tlZDogXCIgKyBjb3VudHJ5X25hbWUpO1xuICAgICAgICAvLyAgICAgdG9nZ2xlX2xpbmVDaGFydF92aXNpYmlsaXR5KCk7XG4gICAgICAgIC8vIH0pXG5cbiAgICB9KTtcbn1cblxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFpQkE7QUFDQTtBQWxCQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7OztBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./scripts/map.js\n");

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