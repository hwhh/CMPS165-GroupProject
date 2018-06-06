const map_width = 1200,
    map_height = 600,
    slider_height = 100,
    slider_width = 500;
const padding = 40;


/**
 * TOTAL WATER STRESS LEVEL
 * For each country Find
 * Water Stress as a % = X = Total Water Used / Total Water (Total Internal + Total External)
 * Find max(X)
 * Divide each country by max(X) and multiply by 5
 *
 * [SDG 6.4.2. Water Stress] = 100*[Total freshwater withdrawal (primary and secondary)]/([Total renewable water resources]-[Environmental Flow Requirements])
 *
 *
 *
 */
// const years = [[1978, 1982], [1983, 1987], [1988, 1992], [1993, 1997], [1998, 2002], [2003, 2007], [2008, 2012], [2013, 2017]];
const years = ['1978-1982', '1983-1987', '1988-1992', '1993-1997', '1998-2002', '2003-2007', '2008-2012', '2013-2017'];

let total_internal_water = new Map();
let total_external_water = new Map();
let total_available_water = new Map();
let total_water_used = new Map();
let water_stress_levels = new Map();

let xScale, yScale, xAxis, yAxis;  //Empty, for now

//For converting Dates to strings
const formatTime = d3.timeFormat("%Y");
//Function for converting CSV values from strings to Dates and numbers
const parseTime = d3.timeParse("%Y");

const x = d3.scaleLinear()
    .domain([1960, 2040])
    .range([0, 600])
    .clamp(true);

const svg = d3.select("body").append("svg");

// var circle = map_svg.append("circle").attr("id", "foo");
// var svg2 = map_svg.insert("map_svg", "#foo");
// svg2.attr("id", "childSVG");


const svg_map = svg.append('svg')
// .attr('id', 'map')
    .attr('width', map_width)
    .attr('height', map_height + 50);

// const svg_slider = map_svg.insert('svg_slider', '#map')
//     .attr('id', 'slider')
//     .attr('width', slider_width)
//     .attr('height', slider_height);

const slider = svg_map.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + 300 + "," + 600 + ")");

const projection = d3.geoMercator()
    .scale(100)
    .translate([map_width / 2, map_height / 2.5]);

const path = d3.geoPath()
    .projection(projection);

const color = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range(d3.schemeBlues[7]);


// creates a group for the linegraph and creates a toggle button
const lineGraph_group = svg_map.append('g').attr('visibility', 'hidden');

const back2Map_button = lineGraph_group.append("rect")
    .attr("class", "back2Map_button")
    .attr("transform", "translate(" + 1100 + "," + 0 + ")")
    .attr('map_width', 100)
    .attr('map_height', 50)
    .attr('fill', 'lightblue')
    .on('click', function () {
        // toggle visibility
        world_map.attr('visibility', 'visible');
        slider.attr('visibility', 'visible');
        lineGraph_group.attr('visibility', 'hidden');
    });


lineGraph_group.append("text")
    .attr("class", "back_label")
    .attr("transform", "translate(" + 1150 + "," + 30 + ")")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("pointer-events", "none")
    .text("Back");


function renderMap(data) {
    d3.json('./Data/world.geojson', function (error, mapData) {
        const features = mapData.features;
        world_map = svg_map.append('g')
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
            .on("mouseover", function (d) {
                let country_name = d.properties.ADMIN;
                //console.log(country_name);

                //defines the color change on hover
                d3.select(this)
                    .style("fill", "orange");
            })
            .on("mouseout", function (d) {
                d3.select(this).style("fill", function (d) {
                    let country_name = d.properties.ADMIN;
                    //console.log(country_name);
                    return color(Math.floor(Math.random() * 10) + 1);
                });
            })
            .on("click", function (d) {
                let country_name = d.properties.ADMIN;
                console.log("clicked: " + country_name);
                toggle_lineChart_visibility();
            })

    });
}


function toggle_lineChart_visibility() {
    // Hide the world map and let the line graph be visible
    world_map.attr('visibility', 'hidden');
    slider.attr('visibility', 'hidden');
    lineGraph_group.attr('visibility', 'visibile');
}


function lineChart() {
    d3.csv("./Data/current.csv", function (error1, data1) {
        d3.csv("./Data/predicted.csv", function (error2, data2) {
            data1.forEach(function (d) {
                d.year = parseTime(d.year);
                d.score = +d.score;
            });

            data2.forEach(function (d) {
                d.year = parseTime(d.year);
                d.pessimistic = +d.pessimistic;
                d.optimistic = +d.optimistic;
                d.bau = +d.bau;
            });

            xScale = d3.scaleTime()
                .domain([
                    d3.min(data1, function (d) {
                        return d.year;
                    }),
                    d3.max(data2, function (d) {
                        return d.year;
                    })
                ])
                .range([padding + 100, map_width - 100]);

            yScale = d3.scaleLinear()
                .domain([0, 5])
                .range([map_height - 40, padding]);

            //Define axes
            xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(10)
                .tickFormat(formatTime);

            //Define Y axis
            yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);

            //Define line generators
            line = d3.line()
                .defined(function (d) {
                    return d.year >= parseTime(1960) && d.year <= parseTime(2015);
                })
                .x(function (d) {
                    return xScale(d.year);
                })
                .y(function (d) {
                    return yScale(d.score);
                });

            pessimisticLine = d3.line()
                .defined(function (d) {
                    return d.year >= parseTime(2015);
                })
                .x(function (d) {
                    return xScale(d.year);
                })
                .y(function (d) {
                    return yScale(d.pessimistic);
                });

            optimisticLine = d3.line()
                .defined(function (d) {
                    return d.year >= parseTime(2015);
                })
                .x(function (d) {
                    return xScale(d.year);
                })
                .y(function (d) {
                    return yScale(d.optimistic);
                });

            bauLine = d3.line()
                .defined(function (d) {
                    return d.year >= parseTime(2015);
                })
                .x(function (d) {
                    return xScale(d.year);
                })
                .y(function (d) {
                    return yScale(d.bau);
                });


            //Draw predicted line
            lineGraph_group.append("line")
                .attr("class", "line predicted")
                .attr("x1", xScale(parseTime(2015)))
                .attr("x2", xScale(parseTime(2015)))
                .attr("y1", padding)
                .attr("y2", map_height);

            //Label predicted line
            lineGraph_group.append("text")
                .attr("class", "predictedLabel")
                .attr("x", xScale(parseTime(2015)))
                .attr("y", padding)
                .text("Predicted");


            //Create lines
            lineGraph_group.append("path")
                .datum(data1)
                .attr("class", "line")
                .attr("d", line);


            lineGraph_group.append("path")
                .datum(data2)
                .attr("class", "line pessimistic")
                .attr("d", pessimisticLine);

            lineGraph_group.append("path")
                .datum(data2)
                .attr("class", "line optimistic")
                .attr("d", optimisticLine);

            lineGraph_group.append("path")
                .datum(data2)
                .attr("class", "line bau")
                .attr("d", bauLine);

            //Create axes
            lineGraph_group.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (map_height - padding) + ")")
                .call(xAxis);

            lineGraph_group.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (padding + 100) + ",0)")
                .call(yAxis);

        });
    });
}

function createSlider() {

    var data3 = d3.range(0, 10).map(function (d) {
        return new Date(1995 + d, 10, 3);
    });

    var slider3 = d3.sliderHorizontal()
        .min(d3.min(data3))
        .max(d3.max(data3))
        .step(1000 * 60 * 60 * 24 * 365)
        .width(400)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(data3)
        .on('onchange', val => {
            d3.select("p#value3").text(d3.timeFormat('%Y')(val));
        });


    svg_slider.call(slider3);
}

// d3.select("p#value3").text(d3.timeFormat('%Y')(slider3.value()));
// d3.select("a#setValue3").on("click", () => slider3.value(new Date(1997, 11, 17)));

// function createSlider(){
//     slider.append("line")
//         .attr("class", "track")
//         .attr("x1", x.range()[0])
//         .attr("x2", x.range()[1])
//         .select(function () {
//             return this.parentNode.appendChild(this.cloneNode(true));
//         })
//         .attr("class", "track-inset")
//         .select(function () {
//             return this.parentNode.appendChild(this.cloneNode(true));
//         })
//         .attr("class", "track-overlay")
//         .call(d3.drag()
//             .on("start.interrupt", function () {
//                 slider.interrupt();
//             })
//             .on("start drag", function () {
//                 hue(x.invert(d3.event.x));
//             }));
//
//     slider.insert("g", ".track-overlay")
//         .attr("class", "ticks")
//         .attr("transform", "translate(0," + 18 + ")")
//         .selectAll("text")
//         .data(x.ticks(10))
//         .enter().append("text")
//         .attr("x", x)
//         .attr("text-anchor", "middle")
//         .text(function (d) {
//             return d;
//         });
//     const handle = slider.insert("circle", ".track-overlay")
//         .attr("class", "handle")
//         .attr("r", 9);
// }
//
//
// slider.transition() // Gratuitous intro!
//    .duration(750)
//    .tween("hue", function() {
//      var i = d3.interpolate(0, 70);
//      return function(t) { hue(i(t)); };
//    });
//
// function hue(h) {
//  handle.attr("cx", x(h));
//  svg_map.style("background-color", d3.hsl(h, 0.8, 0.8));
// }


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
    // createSlider();
});


//
// function calculateScore() {
//     let max = -1;
//     _.union(Array.from(total_internal_water.keys()), Array.from(total_external_water.keys())).forEach(function (key) {
//         let external = total_external_water.get(key);
//         let internal = total_internal_water.get(key);
//         let withdraws = total_water_used.get(key);
//         if (external === undefined)
//             external = {};
//         if (internal === undefined)
//             internal = {};
//         if (withdraws === undefined)
//             withdraws = {};
//         years.forEach(function (year) {
//             let values = total_available_water.get(year);
//             if (values === undefined) {
//                 values = {}
//             }
//             let external_value = external[year];
//             let internal_value = internal[year];
//             let withdrawn_value = withdraws[year];
//             if (withdrawn_value === undefined || external_value === undefined || internal_value === undefined)
//                 values[key] = "No Data";
//             else {
//                 values[key] = withdrawn_value / (external_value + internal_value);
//                 if (values[key] > max)
//                     max = values[key];
//             }
//             total_available_water.set(year, values)
//         });
//     });
//     Array.from(total_available_water.keys()).forEach(function (key) {
//         total_available_water.get(key);
//         _.union(Array.from(total_internal_water.keys()), Array.from(total_external_water.keys())).forEach(function (key) {
//
//
//         })
//     })
// }