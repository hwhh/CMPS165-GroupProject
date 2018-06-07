import * as utils from "./index";
import {width, height} from "./variables";
import {renderLineChart} from "./line_chart";


let colours = {};

export const projection = d3.geoMiller()
    .scale(150)
    .translate([width / 2, height / 1.8]);

export const path = d3.geoPath()
    .projection(projection);

export const color = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5])
    .range(d3.schemeReds[5]);


export function renderMap(data) {
    d3.json('./Data/countries.geojson', function (error, mapData) {
        const features = mapData.features;
        utils.svg.append('g')
            .attr('id', 'map')
            .attr('class', 'countries')
            .style('display', 'block')
            .selectAll('path')
            .data(features)
            .enter()
            .append('path')
            .attr('id', function (d) {
                return d.properties.name
            })
            .attr('d', path)
            .style('fill', function (d) {
                let value = data[d.properties.name];
                if (value === -1 || value === undefined)
                    return d3.color("grey");
                else {
                    let c = color(data[d.properties.name]);
                    let country_names;
                    if(colours[c] === undefined)
                        country_names = [];
                    else
                        country_names = colours[c];
                    country_names.push(d.properties.name);
                    colours[c] = country_names;
                    return c
                }
            })
            .on("mouseover", function (d) {
                let country_name = d.properties.name;
                if(data[d.properties.name] !== -1 && data[d.properties.name] !== undefined)
                    d3.select(this).style("fill", "orange");
            })
            .on("mouseout", function (d) {
                if(data[d.properties.name] !== -1 && data[d.properties.name] !== undefined){
                    d3.select(this).style("fill", function (d) {
                        let c = color(data[d.properties.name]);
                        return c
                    });
                }
            })
            .on("click", function (d) {
                if(data[d.properties.name] !== -1 && data[d.properties.name] !== undefined){
                    let country_name = d.properties.name;
                    console.log("clicked: " + country_name);
                    utils.showLineChart();
                    renderLineChart(country_name)
                }
            })

    });

}

