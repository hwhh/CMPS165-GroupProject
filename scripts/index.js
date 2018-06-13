import {renderMap} from "./map";
import {createSlider} from "./slider";


import {width, height, display_country} from "./variables";
import {renderLineChart} from "./line_chart";
import {create_modal} from "./country_search";

export let total_internal_water = new Map();
export let total_external_water = new Map();
export let total_available_water = new Map();
export let total_water_used = new Map();
export let water_stress_levels = new Map();
/////////////////////////////////////////////
export let water_stress_levels_bau = new Map();
export let water_stress_levels_pst = new Map();
export let water_stress_levels_opt = new Map();


export let water_stress = [], water_stress_bau = [], water_stress_opt = [], water_stress_pst = [];


export const formatTime = d3.timeFormat("%Y");
export const parseTime = d3.timeParse("%Y");


//TODO change this and add proper padding
export const svg = d3.select("body").append("svg")
    .attr('width', width + 150)
    .attr('height', height + 50);

export function showLineChart() {
    d3.select('svg').select('#map').transition().duration(1000).style('display', 'none');
    d3.select('svg').select('#slider').transition().duration(1000).style('display', 'none');
    d3.select('svg').select('#key').transition().duration(1000).style('display', 'none');
    d3.select('svg').select('#line_chart').style('display', 'visible');
    // d3.select('svg').select('#line_chart').style('display', 'visible');
}

export function showMap() {
    d3.select('svg').select('#map').transition().duration(1000).style('display', 'visible');
    d3.select('svg').select('#slider').transition().duration(1000).style('display', 'visible');
    d3.select('svg').select('#key').transition().duration(1000).style('display', 'visible');
    d3.select('svg').selectAll('g').select('#line_chart').transition().duration(1000).style('display', 'none');
}


export function getAllValuesForCountry(map, country, index_1, index_2) {
    let values = [];
    map.forEach(function (value, key) {
        if (value[country] !== -1)
            values.push({date: key.substring(index_1, index_2), value: value[country]});
    });
    return {id: country, display: display_country[country].display, values: values}
}



function loadDataset(map, file, func) {
    return new Promise((resolve, reject) => {
        d3.csv(file, function (data) {
            data.forEach(function (d) {
                let values = {};
                Object.keys(d).forEach(function (key) {
                    if (key !== 'Year') {
                        if ((+d[key]) === 0 || (+d[key]) === -1) {
                            values[key.replace(/\(/g, '').replace(/\)/g, '').replace(/'/g, '').replace(/ /g, '-')] = -1;
                        } else {
                            values[key.replace(/\(/g, '').replace(/\)/g, '').replace(/'/g, '').replace(/ /g, '-')] = func((+d[key]));
                        }
                    }
                });
                map.set(d.Year, values)
            });
            resolve();
        });
    });
}

Promise.all([
    loadDataset(water_stress_levels, './Data/stress_levels/water_stress_levels.csv', function (val) {
        return val * 100
    }),
    loadDataset(total_external_water, './Data/water_use/total_external.csv', function (val) {
        return val
    }),
    loadDataset(total_internal_water, './Data/water_use/total_internal.csv', function (val) {
        return val
    }),
    loadDataset(total_water_used, './Data/water_use/total_withdrawn.csv', function (val) {
        return val
    }),
    loadDataset(water_stress_levels_bau, './Data/stress_levels/bau_predictions.csv', function (val) {
        return val * 100
    }),
    loadDataset(water_stress_levels_opt, './Data/stress_levels/opt_predictions.csv', function (val) {
        return val * 100
    }),
    loadDataset(water_stress_levels_pst, './Data/stress_levels/pst_predictions.csv', function (val) {
        return val * 100
    }),
]).then(values => {
    renderMap(water_stress_levels.get('1978-1982'), '1978-1982');
    createSlider();
    console.log("here")

    Object.keys(display_country).forEach(function (d) {
        water_stress.push(getAllValuesForCountry(water_stress_levels, d, 5, 9));
        water_stress_bau.push(getAllValuesForCountry(water_stress_levels_bau, d, 0, 4));
        water_stress_opt.push(getAllValuesForCountry(water_stress_levels_opt, d, 0, 4));
        water_stress_pst.push(getAllValuesForCountry(water_stress_levels_pst, d, 0, 4));
    });

    console.log(water_stress_levels)
    console.log(water_stress_levels_pst)

    Object.keys(water_stress_levels.get('1978-1982')).forEach(function (key) {
        console.log('\"' + key + '\": {display: false},')
    });

     //renderLineChart();
     //create_modal();
}); 


