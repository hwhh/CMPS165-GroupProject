import * as utils from "./index";
import {width, height} from "./variables";


export const projection = d3.geoMercator()
    .scale(100)
    .translate([width / 2, height / 2.5]);

export const path = d3.geoPath()
    .projection(projection);

export const color = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range(d3.schemeBlues[7]);



export function renderMap(data) {
    d3.json('./Data/world.geojson', function (error, mapData) {
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
                // return color(data.get());
                return color(Math.floor(Math.random() * 10) + 1);
            })
        // .on("mouseover", function (d) {
        //     let country_name = d.properties.ADMIN;
        //     //console.log(country_name);
        //
        //     //defines the color change on hover
        //     d3.select(this)
        //         .style("fill", "orange");
        // })
        // .on("mouseout", function (d) {
        //     d3.select(this).style("fill", function (d) {
        //         let country_name = d.properties.ADMIN;
        //         //console.log(country_name);
        //         return color(Math.floor(Math.random() * 10) + 1);
        //     });
        // })
        // .on("click", function (d) {
        //     let country_name = d.properties.ADMIN;
        //     console.log("clicked: " + country_name);
        //     toggle_lineChart_visibility();
        // })

    });
}

