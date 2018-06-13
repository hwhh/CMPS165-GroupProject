import * as utils from "./index";
import {width, height, display_country} from "./variables";
import {updateChart} from "./line_chart";

export const projection = d3.geoMiller()
    .scale(150)
    .translate([width / 2, height / 1.8]);

export const path = d3.geoPath()
    .projection(projection);

var xPos = [440, 520, 600, 680, 760];
//
var scale = d3.scaleLinear()
    .domain([0, 500])
    .range([440, 840]);

export const color = d3.scaleThreshold()
    .domain([0, 100, 200, 300, 400, 500])
    .range(d3.schemeReds[6]);

var xDensity = d3.scaleSqrt()
    .domain([0, 500])
    .rangeRound([440, 760]);


let map;

let colours = {};

export let futureOptions = "bau";

export function renderMap(data) {
    d3.json('./Data/countries.geojson', function (error, mapData) {
        const features = mapData.features;
        map = utils.svg.append('g')
            .attr('id', 'map')
            .attr('class', 'countries')
            .attr("transform", "translate(50,0)")
            .selectAll('path')
            .data(features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('id', function (d) {
                return d.properties.name;
            })
            .style('stroke', "#FFF")
            .style('fill', function (d) {
                let value = data[d.properties.name];
                if (value === 0 || value === -1 || value === undefined)
                    return "#ccc";
                else {
                    let c = color(data[d.properties.name]);
                    let country_names;
                    if (colours[c] === undefined)
                        country_names = [];
                    else
                        country_names = colours[c];
                    country_names.push(d.properties.name);
                    colours[c] = country_names;
                    return c
                }
            }).on("mouseover", function (d) {
                let country_name = d.properties.name;
                if (data[d.properties.name] !== 0 && data[d.properties.name] !== -1 && data[d.properties.name] !== undefined)
                    d3.select(this).style("fill", "orange");
            })
            .on("mouseout", function (d) {
                if (data[d.properties.name] !== 0 && data[d.properties.name] !== -1 && data[d.properties.name] !== undefined) {
                    d3.select(this).style("fill", function (d) {
                        let c = color(data[d.properties.name]);
                        return c
                    });
                }
            })
            .on("click", function (d) {
                if (data[d.properties.name] !== 0 && data[d.properties.name] !== -1 && data[d.properties.name] !== undefined) {
                    let country_name = d.properties.name;
                    console.log("clicked: " + country_name);
                    display_country[country_name].display = true;
                    updateChart();
                    utils.showLineChart();
                }
            })

    });

    legend(colours);
    bau();
    optimistic();
    pessimistic();

}

export function updateMap(data) {

    colours = {};
    map.transition().duration(1000)
        .style("fill", function (d) {
            //Get data value
            let value = data[d.properties.name];
            if (value === 0 || value === -1 || value === undefined)
                return "#ccc";
            else {
                let c = color(data[d.properties.name]);
                let country_names;
                if (colours[c] === undefined)
                    country_names = [];
                else
                    country_names = colours[c];
                country_names.push(d.properties.name);
                colours[c] = country_names;
                return c
            }
        });

    map.on("mouseover", function (d) {
        let country_name = d.properties.name;
        if (data[d.properties.name] !== 0 && data[d.properties.name] !== -1 && data[d.properties.name] !== undefined)
            d3.select(this).style("fill", "orange");
    })
        .on("mouseout", function (d) {
            if (data[d.properties.name] !== 0 && data[d.properties.name] !== -1 && data[d.properties.name] !== undefined) {
                d3.select(this).style("fill", function (d) {
                    let c = color(data[d.properties.name]);
                    return c
                });
            }
        })
        .on("click", function (d) {
            if (data[d.properties.name] !== 0 && data[d.properties.name] !== -1 && data[d.properties.name] !== undefined) {
                let country_name = d.properties.name;
                console.log("clicked: " + country_name);
                display_country[country_name].display = true;
                updateChart();
                utils.showLineChart();
            }
        });

    legend(colours);


}

function legend(c) {

    var colours = c;
    //Define legend
    var legend = utils.svg.append("g")
        .attr("id", "key")
        .attr("transform", "translate(40,550)");

    //Setting up the legend
    legend.selectAll("rect")
        .data(color.range().map(function (d) {
            //mapping the color density value to the domain according to the data
            //invert extent return all the values in the domain that corresponds the range
            //looping through the domain, setting the range between each color bar
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = xDensity.domain()[0]; //get the first and second value, storing then in the map
            if (d[1] == null) d[1] = xDensity.domain()[1]; //this gets the range between each tick
            return d;
        }))
        .enter()
        .append("rect")
        .attr('id', function (d) {
            return color(d[0]);
        })
        .attr("height", 8) //this creates the color bars between the values
        .attr("x", function(d) { console.log(d[0]); return xPos[d[0]/100]; })
        .attr("width", 80)
        .attr("fill", function(d) { return color(d[0]); })
        .on("mouseover", function (d) {
            var previousElement = d3.select(this);
            for (var key in colours) {
                if (previousElement.attr("fill") === key) {
                    previousElement.style("fill", "#000080");
                    var i;
                    for (i = 0; i < colours[key].length; i++) {
                        d3.select('svg')
                            .select('#map')
                            .select('#' + colours[key][i])
                            .style("fill", "#000080");
                    }
                }
            }

        })
        .on("mouseout", function (d) {
            var previousElement = d3.select(this);
            for (var key in colours) {
                if (previousElement.attr("fill") === key) {
                    previousElement.style("fill", key);
                    var i;
                    for (i = 0; i < colours[key].length; i++) {
                        d3.select('svg')
                            .select('#map')
                            .select('#' + colours[key][i])
                            .style("fill", key);
                    }
                }
            }
        });

    //adding the data value title
    legend.append("text")
        .attr("class", "caption")
        .attr("x", xDensity.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Water Stress Score");

    //adding the value of the domain in the legend, creating the x axis using the x scale created for the data
    //tick size is 13 so all the values of the domain will appear on page
    legend.call(d3.axisBottom(scale)
        .tickSize(13)
        .tickValues(color.domain()))
        .select(".domain")
        .remove();

}


export function bau(data){

    d3.select('#bau')
        .on("click", function (d) {
            futureOptions = 'bau';
            console.log("bau");
            d3.select('svg').select('#key').remove();
            updateMap(data);
            //call updateData

        })

}

export function optimistic(data) {

    d3.select('#optimistic')
        .on("click", function (d) {
            futureOptions = 'optimistic';
            console.log("optimistic");
            d3.select('svg').select('#key').remove();
            updateMap(data);
            //call updateData

        })

}

export function pessimistic(data) {

    d3.select('#pessimistic')
        .on("click", function (d) {
            futureOptions = 'pessimistic';
            console.log("pessimistic");
            d3.select('svg').select('#key').remove();
            updateMap(data);
            //call updateData

        })

}

