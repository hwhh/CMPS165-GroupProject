import * as utils from "./index";
import {width, height} from "./variables";
import {renderLineChart} from "./line_chart";

/**
 * No Data
 * @type {*|void}
 */

export const projection = d3.geoMiller()
    .scale(150)
    .translate([width / 2, height / 1.8]);

export const path = d3.geoPath()
    .projection(projection);

export const color = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range(d3.schemeReds[7]);


export function renderMap(data) {
    d3.json('./Data/countries.geojson', function (error, mapData) {
        const features = mapData.features;
        utils.svg.append('g')
            .attr('id', 'map')
            .attr('class', 'countries')
            .style('display', 'block')
            .selectAll('path')
            .data(features)
            .enter().append('path')
            .attr('d', path)
            .style('fill', function (d) {
                let value = data[d.properties.name];
                if (value === -1)
                    return d3.color("grey");
                else
                    return color(data[d.properties.name]);
            })
            .on("mouseover", function (d) {
                let country_name = d.properties.name;
                if(data[d.properties.name] !== -1)
                    d3.select(this).style("fill", "orange");
            })
            .on("mouseout", function (d) {
                if(data[d.properties.name] !== -1) {
                    d3.select(this).style("fill", function (d) {
                        return color(data[d.properties.name]);
                    });
                }
            })
            .on("click", function (d) {
                if(data[d.properties.name] !== -1) {
                    let country_name = d.properties.name;
                    console.log("clicked: " + country_name);
                    utils.show_line_chart();
                    renderLineChart(data)
                }
            })

    });
}

