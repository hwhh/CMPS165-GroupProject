import {renderMap} from "./map";
import {createSlider} from "./slider";
import {width, height} from "./variables";
import {renderLineChart} from "./line_chart";

export let total_internal_water = new Map();
export let total_external_water = new Map();
export let total_available_water = new Map();
export let total_water_used = new Map();
export let water_stress_levels = new Map();

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

export function getAllValuesForCountry(country) {
    let values = [];
    water_stress_levels.forEach(function (value, key) {
        if(value[country] !== -1)
            values.push({date:key.substring(0,4), value:value[country]});
    });
    return {id:country, values:values}
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
                        if(d[key] === "")
                            values[key] = -1;
                        else
                            values[key] = func(+d[key])
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
        return ((val / 100) * 5)
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
]).then(values => {
    // renderMap(water_stress_levels.get('1978-1982'));
    // createSlider();
    renderLineChart("China");
});


