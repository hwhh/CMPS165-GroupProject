import { renderMap } from './map';

const width = 1200, height = 600;
const padding = 40;


let total_internal_water = new Map();
let total_external_water = new Map();
let total_available_water = new Map();
let total_water_used = new Map();
let water_stress_levels = new Map();


const svg = d3.select("body").append("svg")
    .attr('width', width)
    .attr('height', height + 50);


function toggle_lineChart_visibility() {
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
    renderMap();
    lineChart();
    createSlider();
});

