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
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.svg = exports.parseTime = exports.formatTime = undefined;\nexports.toggle_lineChart_visibility = toggle_lineChart_visibility;\n\nvar _map = __webpack_require__(/*! ./map */ \"./scripts/map.js\");\n\nvar _slider = __webpack_require__(/*! ./slider */ \"./scripts/slider.js\");\n\nvar _variables = __webpack_require__(/*! ./variables */ \"./scripts/variables.js\");\n\nvar formatTime = exports.formatTime = d3.timeFormat(\"%Y\");\nvar parseTime = exports.parseTime = d3.timeParse(\"%Y\");\n\nvar svg = exports.svg = d3.select(\"body\").append(\"svg\").attr('width', _variables.width).attr('height', _variables.height + 50);\n\nfunction toggle_lineChart_visibility() {\n    d3.select('svg').select('#map').transition().duration(1000).style('display', 'none');\n    d3.select('svg').select('#slider').transition().duration(1000).style('display', 'none');\n    lineGraph_group.attr('visibility', 'visibile');\n}\n\nfunction loadDataset(map, file, func) {\n    return new Promise(function (resolve, reject) {\n        d3.csv(file, function (data) {\n            data.forEach(function (d) {\n                var values = {};\n                Object.keys(d).forEach(function (key) {\n                    if (key !== 'Year') {\n                        values[key] = func(+d[key]);\n                    }\n                });\n                map.set(d.Year, values);\n            });\n            resolve();\n        });\n    });\n}\n\nPromise.all([loadDataset(_variables.water_stress_levels, './Data/water_stress_levels.csv', function (val) {\n    return val / 100 * 5;\n}), loadDataset(_variables.total_external_water, './Data/external_water.csv', function (val) {\n    return val;\n}), loadDataset(_variables.total_internal_water, './Data/internal_water.csv', function (val) {\n    return val;\n}), loadDataset(_variables.total_water_used, './Data/water_withdraws.csv', function (val) {\n    return val;\n})]).then(function (values) {\n    (0, _map.renderMap)(_variables.water_stress_levels.get('1978-1982'));\n    (0, _slider.createSlider)();\n    // lineChart();\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL2luZGV4LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NjcmlwdHMvaW5kZXguanM/NDMwNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3JlbmRlck1hcH0gZnJvbSBcIi4vbWFwXCI7XG5pbXBvcnQge2NyZWF0ZVNsaWRlcn0gZnJvbSBcIi4vc2xpZGVyXCI7XG5pbXBvcnQge3dpZHRoLCBoZWlnaHQsIHdhdGVyX3N0cmVzc19sZXZlbHMsIHRvdGFsX3dhdGVyX3VzZWQsIHRvdGFsX2V4dGVybmFsX3dhdGVyLCB0b3RhbF9pbnRlcm5hbF93YXRlciwgdG90YWxfYXZhaWxhYmxlX3dhdGVyfSBmcm9tIFwiLi92YXJpYWJsZXNcIjtcblxuXG5leHBvcnQgY29uc3QgZm9ybWF0VGltZSA9IGQzLnRpbWVGb3JtYXQoXCIlWVwiKTtcbmV4cG9ydCBjb25zdCBwYXJzZVRpbWUgPSBkMy50aW1lUGFyc2UoXCIlWVwiKTtcblxuXG5leHBvcnQgY29uc3Qgc3ZnID0gZDMuc2VsZWN0KFwiYm9keVwiKS5hcHBlbmQoXCJzdmdcIilcbiAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0ICsgNTApO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlX2xpbmVDaGFydF92aXNpYmlsaXR5KCkge1xuICAgIGQzLnNlbGVjdCgnc3ZnJykuc2VsZWN0KCcjbWFwJykudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICBkMy5zZWxlY3QoJ3N2ZycpLnNlbGVjdCgnI3NsaWRlcicpLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5zdHlsZSgnZGlzcGxheScsICdub25lJyk7XG4gICAgbGluZUdyYXBoX2dyb3VwLmF0dHIoJ3Zpc2liaWxpdHknLCAndmlzaWJpbGUnKTtcbn1cblxuXG5mdW5jdGlvbiBsb2FkRGF0YXNldChtYXAsIGZpbGUsIGZ1bmMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBkMy5jc3YoZmlsZSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSB7fTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhkKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSAhPT0gJ1llYXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNba2V5XSA9IGZ1bmMoK2Rba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1hcC5zZXQoZC5ZZWFyLCB2YWx1ZXMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cblByb21pc2UuYWxsKFtcbiAgICBsb2FkRGF0YXNldCh3YXRlcl9zdHJlc3NfbGV2ZWxzLCAnLi9EYXRhL3dhdGVyX3N0cmVzc19sZXZlbHMuY3N2JywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICByZXR1cm4gKCh2YWwgLyAxMDApICogNSlcbiAgICB9KSxcbiAgICBsb2FkRGF0YXNldCh0b3RhbF9leHRlcm5hbF93YXRlciwgJy4vRGF0YS9leHRlcm5hbF93YXRlci5jc3YnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHJldHVybiB2YWxcbiAgICB9KSxcbiAgICBsb2FkRGF0YXNldCh0b3RhbF9pbnRlcm5hbF93YXRlciwgJy4vRGF0YS9pbnRlcm5hbF93YXRlci5jc3YnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHJldHVybiB2YWxcbiAgICB9KSxcbiAgICBsb2FkRGF0YXNldCh0b3RhbF93YXRlcl91c2VkLCAnLi9EYXRhL3dhdGVyX3dpdGhkcmF3cy5jc3YnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHJldHVybiB2YWxcbiAgICB9KSxcbl0pLnRoZW4odmFsdWVzID0+IHtcbiAgICByZW5kZXJNYXAod2F0ZXJfc3RyZXNzX2xldmVscy5nZXQoJzE5NzgtMTk4MicpKTtcbiAgICBjcmVhdGVTbGlkZXIoKTtcbiAgICAvLyBsaW5lQ2hhcnQoKTtcbn0pO1xuXG5cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBYUE7QUFDQTtBQWRBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./scripts/index.js\n");

/***/ }),

/***/ "./scripts/map.js":
/*!************************!*\
  !*** ./scripts/map.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.color = exports.path = exports.projection = undefined;\nexports.renderMap = renderMap;\n\nvar _index = __webpack_require__(/*! ./index */ \"./scripts/index.js\");\n\nvar utils = _interopRequireWildcard(_index);\n\nvar _variables = __webpack_require__(/*! ./variables */ \"./scripts/variables.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n/**\n * No Data\n * @type {*|void}\n */\n\nvar projection = exports.projection = d3.geoMiller().scale(150).translate([_variables.width / 2, _variables.height / 1.8]);\n\nvar path = exports.path = d3.geoPath().projection(projection);\n\nvar color = exports.color = d3.scaleThreshold().domain([1, 2, 3, 4, 5, 6, 7, 8, 9]).range(d3.schemeReds[7]);\n\nfunction renderMap(data) {\n    d3.json('./Data/countries.geojson', function (error, mapData) {\n        var features = mapData.features;\n        utils.svg.append('g').attr('id', 'map').attr('class', 'countries').style('display', 'block').selectAll('path').data(features).enter().append('path').attr('d', path).style('fill', function (d) {\n            return color(data[d.properties.name]);\n        }).on(\"mouseover\", function (d) {\n            var country_name = d.properties.name;\n            d3.select(this).style(\"fill\", \"orange\");\n        }).on(\"mouseout\", function (d) {\n            d3.select(this).style(\"fill\", function (d) {\n                return color(data[d.properties.name]);\n            });\n        }).on(\"click\", function (d) {\n            var country_name = d.properties.name;\n            console.log(\"clicked: \" + country_name);\n            // utils.toggle_lineChart_visibility();\n        });\n    });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL21hcC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zY3JpcHRzL21hcC5qcz82ZDIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQge3dpZHRoLCBoZWlnaHR9IGZyb20gXCIuL3ZhcmlhYmxlc1wiO1xuXG5cbi8qKlxuICogTm8gRGF0YVxuICogQHR5cGUgeyp8dm9pZH1cbiAqL1xuXG5leHBvcnQgY29uc3QgcHJvamVjdGlvbiA9IGQzLmdlb01pbGxlcigpXG4gICAgLnNjYWxlKDE1MClcbiAgICAudHJhbnNsYXRlKFt3aWR0aCAvIDIsIGhlaWdodCAvIDEuOF0pO1xuXG5leHBvcnQgY29uc3QgcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgIC5wcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuXG5leHBvcnQgY29uc3QgY29sb3IgPSBkMy5zY2FsZVRocmVzaG9sZCgpXG4gICAgLmRvbWFpbihbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV0pXG4gICAgLnJhbmdlKGQzLnNjaGVtZVJlZHNbN10pO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJNYXAoZGF0YSkge1xuICAgIGQzLmpzb24oJy4vRGF0YS9jb3VudHJpZXMuZ2VvanNvbicsIGZ1bmN0aW9uIChlcnJvciwgbWFwRGF0YSkge1xuICAgICAgICBjb25zdCBmZWF0dXJlcyA9IG1hcERhdGEuZmVhdHVyZXM7XG4gICAgICAgIHV0aWxzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmF0dHIoJ2lkJywgJ21hcCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY291bnRyaWVzJylcbiAgICAgICAgICAgIC5zdHlsZSgnZGlzcGxheScsICdibG9jaycpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgICAgICAgIC5kYXRhKGZlYXR1cmVzKVxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgIC5hdHRyKCdkJywgcGF0aClcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yKGRhdGFbZC5wcm9wZXJ0aWVzLm5hbWVdKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICBsZXQgY291bnRyeV9uYW1lID0gZC5wcm9wZXJ0aWVzLm5hbWU7XG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwiZmlsbFwiLCBcIm9yYW5nZVwiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yKGRhdGFbZC5wcm9wZXJ0aWVzLm5hbWVdKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIGxldCBjb3VudHJ5X25hbWUgPSBkLnByb3BlcnRpZXMubmFtZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrZWQ6IFwiICsgY291bnRyeV9uYW1lKTtcbiAgICAgICAgICAgICAgICAvLyB1dGlscy50b2dnbGVfbGluZUNoYXJ0X3Zpc2liaWxpdHkoKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICB9KTtcbn1cblxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFxQkE7QUFDQTtBQXRCQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7OztBQUVBOzs7OztBQUtBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBU0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./scripts/map.js\n");

/***/ }),

/***/ "./scripts/slider.js":
/*!***************************!*\
  !*** ./scripts/slider.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.createSlider = createSlider;\n\nvar _index = __webpack_require__(/*! ./index */ \"./scripts/index.js\");\n\nvar utils = _interopRequireWildcard(_index);\n\nvar _variables = __webpack_require__(/*! ./variables */ \"./scripts/variables.js\");\n\nvar _map = __webpack_require__(/*! ./map */ \"./scripts/map.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction createSlider() {\n\n    var data3 = d3.range(0, Object.keys(_variables.years).length).map(function (d) {\n        return new Date(Object.keys(_variables.years)[d], 10, 3);\n    });\n\n    var slider3 = d3.sliderHorizontal().min(d3.min(data3)).max(d3.max(data3)).width(450).tickFormat(d3.timeFormat('%Y')).tickValues(data3).on('onchange', function (val) {\n        var keys = Object.keys(_variables.years);\n        var current_year = _variables.years[keys.reverse().find(function (e) {\n            return e <= utils.formatTime(val);\n        })];\n        var millisecondsToWait = 500;\n        setTimeout(function () {\n            (0, _map.renderMap)(_variables.water_stress_levels.get(current_year));\n        }, millisecondsToWait);\n    });\n\n    utils.svg.append('g').attr(\"transform\", \"translate(\" + (_variables.width / 2 - _variables.slider_width / 2 + _variables.padding) + \", \" + _variables.height + \")\").attr('width', _variables.slider_width).attr('height', _variables.slider_height).call(slider3);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL3NsaWRlci5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zY3JpcHRzL3NsaWRlci5qcz84YjkwIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCB7d2lkdGgsIGhlaWdodCwgc2xpZGVyX2hlaWdodCwgc2xpZGVyX3dpZHRoLCB5ZWFycywgcGFkZGluZywgd2F0ZXJfc3RyZXNzX2xldmVsc30gZnJvbSBcIi4vdmFyaWFibGVzXCI7XG5pbXBvcnQge3JlbmRlck1hcH0gZnJvbSBcIi4vbWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTbGlkZXIoKSB7XG5cbiAgICBjb25zdCBkYXRhMyA9XG4gICAgICAgIGQzLnJhbmdlKDAsIE9iamVjdC5rZXlzKHllYXJzKS5sZW5ndGgpLm1hcChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKE9iamVjdC5rZXlzKHllYXJzKVtkXSwgMTAsIDMpO1xuICAgICAgICB9KTtcblxuICAgIGNvbnN0IHNsaWRlcjMgPSBkMy5zbGlkZXJIb3Jpem9udGFsKClcbiAgICAgICAgLm1pbihkMy5taW4oZGF0YTMpKVxuICAgICAgICAubWF4KGQzLm1heChkYXRhMykpXG4gICAgICAgIC53aWR0aCg0NTApXG4gICAgICAgIC50aWNrRm9ybWF0KGQzLnRpbWVGb3JtYXQoJyVZJykpXG4gICAgICAgIC50aWNrVmFsdWVzKGRhdGEzKVxuICAgICAgICAub24oJ29uY2hhbmdlJywgdmFsID0+IHtcbiAgICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoeWVhcnMpO1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRfeWVhciA9IHllYXJzW2tleXMucmV2ZXJzZSgpLmZpbmQoZSA9PiBlIDw9IHV0aWxzLmZvcm1hdFRpbWUodmFsKSldO1xuICAgICAgICAgICAgY29uc3QgbWlsbGlzZWNvbmRzVG9XYWl0ID0gNTAwO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyTWFwKHdhdGVyX3N0cmVzc19sZXZlbHMuZ2V0KGN1cnJlbnRfeWVhcikpXG4gICAgICAgICAgICB9LCBtaWxsaXNlY29uZHNUb1dhaXQpO1xuICAgICAgICB9KTtcblxuXG4gICAgdXRpbHMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKCh3aWR0aCAvIDIpIC0gKHNsaWRlcl93aWR0aCAvIDIpICsgcGFkZGluZykgKyBcIiwgXCIgKyAoaGVpZ2h0KSArIFwiKVwiKVxuICAgICAgICAuYXR0cignd2lkdGgnLCBzbGlkZXJfd2lkdGgpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCBzbGlkZXJfaGVpZ2h0KVxuICAgICAgICAuY2FsbChzbGlkZXIzKTtcblxuXG59Il0sIm1hcHBpbmdzIjoiOzs7OztBQUtBO0FBQ0E7QUFMQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFPQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./scripts/slider.js\n");

/***/ }),

/***/ "./scripts/variables.js":
/*!******************************!*\
  !*** ./scripts/variables.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nvar width = exports.width = 1200,\n    height = exports.height = 600;\nvar slider_width = exports.slider_width = 500,\n    slider_height = exports.slider_height = 100;\nvar padding = exports.padding = 40;\n\nvar total_internal_water = exports.total_internal_water = new Map();\nvar total_external_water = exports.total_external_water = new Map();\nvar total_available_water = exports.total_available_water = new Map();\nvar total_water_used = exports.total_water_used = new Map();\nvar water_stress_levels = exports.water_stress_levels = new Map();\n\nvar years = exports.years = {\n    1978: '1978-1982',\n    1983: '1983-1987',\n    1988: '1988-1992',\n    1993: '1993-1997',\n    1998: '1998-2002',\n    2003: '2003-2007',\n    2008: '2008-2012',\n    2013: '2013-2017',\n    2018: '2020',\n    2030: '2030',\n    2040: '2040'\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY3JpcHRzL3ZhcmlhYmxlcy5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zY3JpcHRzL3ZhcmlhYmxlcy5qcz8wMjFlIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCB3aWR0aCA9IDEyMDAsIGhlaWdodCA9IDYwMDtcbmV4cG9ydCBjb25zdCBzbGlkZXJfd2lkdGggPSA1MDAsIHNsaWRlcl9oZWlnaHQgPSAxMDA7XG5leHBvcnQgY29uc3QgcGFkZGluZyA9IDQwO1xuXG5cbmV4cG9ydCBsZXQgdG90YWxfaW50ZXJuYWxfd2F0ZXIgPSBuZXcgTWFwKCk7XG5leHBvcnQgbGV0IHRvdGFsX2V4dGVybmFsX3dhdGVyID0gbmV3IE1hcCgpO1xuZXhwb3J0IGxldCB0b3RhbF9hdmFpbGFibGVfd2F0ZXIgPSBuZXcgTWFwKCk7XG5leHBvcnQgbGV0IHRvdGFsX3dhdGVyX3VzZWQgPSBuZXcgTWFwKCk7XG5leHBvcnQgbGV0IHdhdGVyX3N0cmVzc19sZXZlbHMgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBjb25zdCB5ZWFycyA9IHtcbiAgICAxOTc4OiAnMTk3OC0xOTgyJyxcbiAgICAxOTgzOiAnMTk4My0xOTg3JyxcbiAgICAxOTg4OiAnMTk4OC0xOTkyJyxcbiAgICAxOTkzOiAnMTk5My0xOTk3JyxcbiAgICAxOTk4OiAnMTk5OC0yMDAyJyxcbiAgICAyMDAzOiAnMjAwMy0yMDA3JyxcbiAgICAyMDA4OiAnMjAwOC0yMDEyJyxcbiAgICAyMDEzOiAnMjAxMy0yMDE3JyxcbiAgICAyMDE4OiAnMjAyMCcsXG4gICAgMjAzMDogJzIwMzAnLFxuICAgIDIwNDA6ICcyMDQwJyxcbn07Il0sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./scripts/variables.js\n");

/***/ })

/******/ });