const width = 1200,
    height = 600;

const slider_width = 500,
    slider_height = 100;
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


const years = {
    1978: '1978-1982',
    1983: '1983-1987',
    1988: '1988-1992',
    1993: '1993-1997',
    1998: '1998-2002',
    2003: '2003-2007',
    2008: '2008-2012',
    2013: '2013-2017',
    2018: '2020',
    2030: '2030',
    2040: '2040',
};
// const years = [1978, 1983, 1988, 1993, 1998, 2003, 2008, 2013, 2017];
// const years2 = [    ];
// const years2 = ['1978-1982', '1983-1987', '1988-1992', '1993-1997', '1998-2002', '2003-2007', '2008-2012', '2013-2017'];


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


const svg = d3.select("body").append("svg")
    .attr('width', width)
    .attr('height', height + 50);

const projection = d3.geoMercator()
    .scale(100)
    .translate([width / 2, height / 2.5]);

const path = d3.geoPath()
    .projection(projection);

const color = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range(d3.schemeBlues[7]);


// creates a group for the linegraph and creates a toggle button
const lineGraph_group = svg.append('g').attr('visibility', 'hidden');

const back2Map_button = lineGraph_group.append("rect")
    .attr("class", "back2Map_button")
    .attr("transform", "translate(" + 1100 + "," + 0 + ")")
    .attr('width', 100)
    .attr('height', 50)
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
        svg.append('g')
            .attr('class', 'countries')
            .style('display', 'block')
            .selectAll('path')
            .data(features)
            .enter().append('path')
            .attr('d', path)
            .style('fill', function (d) {
                // console.log(data.get(d))

                return color(data[d.properties.ADMIN]);
                // return color(Math.floor(Math.random() * 10) + 1);
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
                    return color(data[d.properties.ADMIN]);
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
    d3.select('svg').select('#map').transition().duration(1000).style('display', 'none');
    d3.select('svg').select('#slider').transition().duration(1000).style('display', 'none');
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
                .range([padding + 100, width - 100]);

            yScale = d3.scaleLinear()
                .domain([0, 5])
                .range([height - 40, padding]);

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
                .attr("y2", height);

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
                .attr("transform", "translate(0," + (height - padding) + ")")
                .call(xAxis);

            lineGraph_group.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (padding + 100) + ",0)")
                .call(yAxis);

        });
    });
}

function createSlider() {

    // var data3 = d3.range(0,  Object.keys(years).length)
    // )Object.keys(years)

    var data3 =
        d3.range(0, Object.keys(years).length).map(function (d) {
            return new Date(Object.keys(years)[d], 10, 3);
        });

    var slider3 = d3.sliderHorizontal()
        .min(d3.min(data3))
        .max(d3.max(data3))
        .width(450)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(data3)
        .on('onchange', val => {
            let keys = Object.keys(years);
            let current_year = years[keys.reverse().find(e => e <= formatTime(val))];
            const millisecondsToWait = 500;
            setTimeout(function() {
                renderMap(water_stress_levels.get(current_year))
            }, millisecondsToWait);

            // d3.select("p#value3").text(d3.timeFormat('%Y')(val));
        });


    // const slider3 = d3.sliderHorizontal()
    //     .ticks(8)
    //     .width(400)
    //     .tickValues([1, 2, 3, 4, 5, 6, 7, 8])
    //     .on('onchange', val => {
    //         current_year = val;
    //         console.log(current_year)
    //         // d3.select("p#value3").text(d3.timeFormat('%Y')(val));
    //     });

    //transform: translate(350px, 500px);
    svg.append('g')
        .attr("transform", "translate(" + ((width / 2) - (slider_width / 2) + padding) + ", " + (height) + ")")
        .attr('width', slider_width)
        .attr('height', slider_height)
        .call(slider3);


    // d3.select("p#value3").text(d3.timeFormat('%Y')(slider3.value()));
    // d3.select("a#setValue3").on("click", () => slider3.value(new Date(1997, 11, 17)));

}

function loadDataset(map, file, func) {
    return new Promise((resolve, reject) => {
        d3.csv(file, function (data) {
            data.forEach(function (d) {
                let values = {};
                Object.keys(d).forEach(function (key) {
                    if (key !== 'Year') {
                        values[key] = +d[key]
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
    console.log(water_stress_levels.get('1978-1982'))
    renderMap(water_stress_levels.get('1978-1982'));
    lineChart();
    createSlider();
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