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
    d3.select('g').select('#line_chart').transition().duration(1000).style('display', 'visibile');
}

export function showMap() {
    d3.select('svg').select('#map').transition().duration(1000).style('display', 'visibile');
    d3.select('svg').select('#slider').transition().duration(1000).style('display', 'visibile');
    d3.select('g').select('#line_chart').transition().duration(1000).style('display', 'none');
}


export function getAllValuesForCountry(map, country) {
    let values = [];
    map.forEach(function (value, key) {
        if (value[country] !== -1)
            values.push({date: key.substring(0, 4), value: value[country]});
    });
    return {id: country, display: display_country[country].display, values: values}
}

// const back2Map_button = lineGraph_group.append("rect")
//     .attr("class", "back2Map_button")
//     .attr("transform", "translate(" + 1100 + "," + 0 + ")")
//     .attr('width', 100)
//     .attr('height', 50)
//     .attr('fill', 'lightblue')
//     .on('click', function () {
//         // toggle visibility
//         d3.select('svg').select('#map').transition().duration(1000).style('display', 'block');
//         d3.select('svg').select('#slider').transition().duration(1000).style('display', 'block');
//         lineGraph_group.attr('visibility', 'hidden');
//     });

function loadDataset(map, file, func) {
    return new Promise((resolve, reject) => {
        d3.csv(file, function (data) {
            data.forEach(function (d) {
                let values = {};
                Object.keys(d).forEach(function (key) {
                    if (key !== 'Year') {
                        key = key.replace(/\(/g, '').replace(/\)/g, '').replace(/'/g, '').replace(/ /g, '-');
                        if (isNaN(parseInt(d[key]))) {
                            values[key.split(' ').join('-')] = -1;
                        } else {
                            values[key.split(' ').join('-')] = func(+d[key])
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
    loadDataset(water_stress_levels, './Data/water_stress_levels.csv', function (val) {
        return val
    }),
    loadDataset(total_external_water, './Data/external_water.csv', function (val) {
        return val
    }),
    loadDataset(total_internal_water, './Data/internal_water.csv', function (val) {
        return val
    }),
    loadDataset(total_water_used, './Data/water_withdraws.csv', function (val) {
        return val
    }),
    loadDataset(water_stress_levels_bau, './Data/bau_predictions.csv', function (val) {
        return val
    }),
    loadDataset(water_stress_levels_opt, './Data/opt_predictions.csv', function (val) {
        return val
    }),
    loadDataset(water_stress_levels_pst, './Data/pst_predictions.csv', function (val) {
        return val
    }),
]).then(values => {
    // renderMap(water_stress_levels.get('1978-1982'));
    // createSlider();
    Object.keys(display_country).forEach(function (d) {
        water_stress.push(getAllValuesForCountry(water_stress_levels, d));


        water_stress_bau.push(getAllValuesForCountry(water_stress_levels_bau, d));
        water_stress_opt.push(getAllValuesForCountry(water_stress_levels_opt, d));
        water_stress_pst.push(getAllValuesForCountry(water_stress_levels_pst, d));
    });
    let max = -Infinity, min = 0;
    water_stress.forEach(function (countries) {
        let current_max = Math.max.apply(Math, countries.values.map(function (o) {
            return o.value;
        }));
        if (current_max > max)
            max = current_max;
    });
    let water_stress_norm = [];
    water_stress.forEach(function (countries) {
        let norm_values = [];
        countries.values.map(function (v) {
            norm_values.push({
                date: v.date,
                value: ((v.value - min) / max) * 5
            });
        });
        water_stress_norm.push({
            id: countries.id,
            display: display_country[countries.id].display,
            values: norm_values
        })
    });
    water_stress = water_stress_norm;
    //normalized = (x-min(x))/(max(x)-min(x))


    renderLineChart();
    create_modal();
});


