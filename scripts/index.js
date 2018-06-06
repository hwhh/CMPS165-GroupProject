import {renderMap} from "./map";
import {createSlider} from "./slider";
import {width, height, water_stress_levels, total_water_used, total_external_water, total_internal_water, total_available_water} from "./variables";


export const formatTime = d3.timeFormat("%Y");
export const parseTime = d3.timeParse("%Y");


export const svg = d3.select("body").append("svg")
    .attr('width', width)
    .attr('height', height + 50);

export function toggle_lineChart_visibility() {
    d3.select('svg').select('#map').transition().duration(1000).style('display', 'none');
    d3.select('svg').select('#slider').transition().duration(1000).style('display', 'none');
    lineGraph_group.attr('visibility', 'visibile');
}


function loadDataset(map, file, func) {
    return new Promise((resolve, reject) => {
        d3.csv(file, function (data) {
            data.forEach(function (d) {
                let values = {};
                Object.keys(d).forEach(function (key) {
                    if (key !== 'Year') {
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
    renderMap(water_stress_levels.get('1978-1982'));
    createSlider();
    // lineChart();
});


