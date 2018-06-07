import * as utils from "./index";
import {width, height, margin, display_country} from "./variables";
import {color, path} from "./map";


//Sets axis scales
const x = d3.scaleTime().range([0, width - 100]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

//Line generator, where the lives are curved
const line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) {
        return x(new Date(d.date))
    })
    .y(function (d) {
        return y(d.value)
    });


function make_x_gridlines() {
    return d3.axisBottom(x)
        .ticks(5)
}

function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(8)
}

function tweenDashoffsetOn() {
    const l = this.getTotalLength(),
        i = d3.interpolateString('' + l, '0');
    return function (t) {
        return i(t)
    }
}

function tweenDashoffsetOff() {
    const l = this.getTotalLength(),
        i = d3.interpolateString('0', '' + l);
    return function (t) {
        return i(t)
    }
}

function mouseOver(g, countries) {
    //Add new element to the DOM
    const mouseG = g.append('g')
        .attr('class', 'mouse-over-effects');

    //This is the black vertical line to follow mouse
    mouseG.append('path')
        .attr('class', 'mouse-line')
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .style('opacity', '0');

    //Get all the lines in the DOM
    const lines = document.getElementsByClassName('line');

    //Adds new elements to the DOM for each country
    const mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(countries)
        .enter()
        .append('g')
        .attr('class', 'country mouse-per-line')
        .attr('id', function (d) {
            return d.id.split(' ').join('_')
        });

    //Adds circles on visible lines
    mousePerLine.append('circle')
        .attr('r', 7)
        .style('stroke', function (d) {
            return z(d.id)
        })
        .style('fill', 'none')
        .style('stroke-width', '1px')
    // .style('opacity', '0')
    // .style('visibility', 'hidden')
    // .filter(function (d) { //Only shows the circles for selected countries
    //     return d.display
    // })
    // .style('visibility', 'visible');

    //Adds text next to the circles for visible lines which show the current value
    mousePerLine.append('text')
        .attr('transform', 'translate(10,3)')
        .style('font', '12px sans-serif')
    // .style('visibility', 'hidden')
    // .filter(function (d) { //Only shows the values for selected countries
    //     return d.display
    // })
    // .style('visibility', 'visible');

    mouseG.append('svg:rect') //Append a rect to catch mouse movements on canvas
        .attr('width', width - 100) //Can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function () { //On mouse out hide line, circles and text
            d3.select('.mouse-line')
                .style('opacity', '0');
            d3.selectAll('.mouse-per-line circle')
                .style('opacity', '0');
            d3.selectAll('.mouse-per-line text')
                .style('opacity', '0')
        })
        .on('mouseover', function () { //On mouse in show line, circles and text
            d3.select('.mouse-line')
                .style('opacity', '1');
            d3.selectAll('.mouse-per-line circle')
                .style('opacity', '1');
            d3.selectAll('.mouse-per-line text')
                .style('opacity', '1')
        })
        .on('mousemove', function () { //Mouse moving over canvas
            const mouse = d3.mouse(this);
            d3.select('.mouse-line')
                .attr('d', function () {
                    let d = 'M' + mouse[0] + ',' + height;
                    d += ' ' + mouse[0] + ',' + 0;
                    return d
                });

            d3.selectAll('.mouse-per-line')
                .attr('transform', function (d, i) {
                    const xDate = x.invert(mouse[0]),
                        bisect = d3.bisector(function (d) {
                            return d.date
                        }).right;
                    idx = bisect(d.values, xDate);

                    let beginning = 0,
                        end = lines[i].getTotalLength(),
                        target = null;

                    while (true) {
                        target = Math.floor((beginning + end) / 2);
                        pos = lines[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break
                        }
                        if (pos.x > mouse[0]) end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break //position found
                    }

                    d3.select(this).select('text')
                        .text(y.invert(pos.y).toFixed(2));

                    return 'translate(' + mouse[0] + ',' + pos.y + ')'
                })
        })
}

function drawGrid() {
    //Add the X gridlines
    utils.svg.append('g')
        .attr('class', 'grid')
        .attr('transform', 'translate(' + (margin.left) + ',' + (height + margin.top) + ')')
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat('')
        );
    //Add the Y gridlines
    utils.svg.append('g')
        .attr('class', 'grid')
        .attr('transform', 'translate(' + (margin.left) + ',' + (margin.top) + ')')
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat('')
        )
}

function drawLines(g, countries) {

    //Add new element to the DOM for each country
    const country = g.selectAll('.country')
        .data(countries)
        .enter().append('g')
        .attr('class', 'country')
        .attr('id', function (d) {
            return d.id.split(' ').join('_')
        });

    //Adds new path elements to the DOM for each country
    country.append('path')
        .attr('class', 'line')
        .attr('d', function (d) {
            return line(d.values) // uses the line generator
        })
        .attr('fill', 'none')
        .style('stroke', function (d) {
            return z(d.id)
        })

    country.append('text')
        .datum(function (d) { //Allows the binding of country data to multiple SVG elements
            console.log({id: d.id, value: d.values[d.values.length - 1]});
            return {id: d.id, value: d.values[d.values.length - 1]}
        })
        .attr('transform', function (d) {
            return 'translate(' + width + ',' + y(d.value.value) + ')'
        })
        .attr('x', 3)
        .attr('dy', '0.35em')
        .style('font', '10px sans-serif')
        .text(function (d) {
            console.log(d.id)
            return d.id
        })
        .style('text-anchor', 'start')
        // .style('opacity', 0)
        // .filter(function (d) { //Only shows the country names for selected countries
        //     return d.display
        // })
        .transition()
        .duration(2000)
        .style('opacity', '1');
    //
    //
    const paths = country.select('path')
        .each(function () {
            d3.select(this)
                .attr('stroke-dasharray', this.getTotalLength() + ',' + this.getTotalLength())
                .attr('stroke-dashoffset', '' + this.getTotalLength())
        })
        // paths.filter(function (d) { // only shows the lines for selected countries
        //     return d.display
        // })
        .transition()
        .duration(2000)
        .attrTween('stroke-dashoffset', tweenDashoffsetOn)

}

function drawAxis(g) {
    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        .append('text')
        .attr('transform', 'translate(' + (width - 100) + ',' + 50 + ')')
        .attr('fill', '#000')
        .text('Year');

    g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('fill', '#000');

    //Adds the y axis title
    utils.svg.append('text')
        .attr('font-family', 'Sans-serif')
        .attr('font-size', '0.8em')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0 - (height / 2) + 30)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Water Stress Level');
}

function create_domains(data) {
    x.domain([utils.parseTime('1978'), utils.parseTime('2040')]);
    // y.domain([0, Math.max.apply(Math, Object.values(data))]);
    // z.domain(data.map(function (c) {
    //     return c.id
    // }));
    y.domain([
        0,
        d3.max(data, function (c) {
            return d3.max(c.values, function (d) {
                return d.value
            })
        })
    ]);
    z.domain(data.map(function (c) {
        return c.id
    }))

}

function checkChanged() {
    let checked = this.checked;
    const countryID = this.getAttribute('countryID');
    const country = this.getAttribute('country');

    const g = d3.select('#' + countryID);

    if (!checked) {
        //Remove the text, line and circle/value of the selected country
        g.select('text')
            .transition()
            .duration(1000)
            .style('opacity', 0);
        g.select('path').transition()
            .duration(2000)
            .attrTween('stroke-dashoffset', tweenDashoffsetOff)
        //Select elements deeper in the DOM
        d3.select('.mouse-over-effects').select('#' + countryID).selectAll('circle')
            .style('visibility', 'hidden');
        d3.select('.mouse-over-effects').select('#' + countryID).selectAll('text')
            .style('visibility', 'hidden');
        display_country[country].display = false
    } else {
        //Add the text, line and circle/value of the selected country
        g.select('text')
            .transition()
            .duration(1000)
            .style('opacity', 1);
        g.select('path').transition()
            .duration(2000)
            .attrTween('stroke-dashoffset', tweenDashoffsetOn)
        //Select elements deeper in the DOM
        d3.select('.mouse-over-effects').select('#' + countryID).selectAll('circle')
            .style('visibility', 'visible');
        d3.select('.mouse-over-effects').select('#' + countryID).selectAll('text')
            .style('visibility', 'visible');
        display_country[country].display = true
    }

}

function drawCheckboxes(countries) {
    const checkboxes = d3.select('.country-list').selectAll('.country-checkbox')
        .data(countries)
        .enter()
        .append('li')
        .attr('class', 'country-checkbox');

    checkboxes.append('input')
        .attr('type', 'checkbox')
        .attr('country', function (d) {
            return d.id
        })
        .attr('id', function (d) {
            return d.id.split(' ').join('_') + '_checkbox'
        })
        .attr('countryID', function (d) {
            return d.id.split(' ').join('_')
        })
        .on('change', checkChanged)// Call checkChanged when changed
        .filter(function (d) {
            return d.display
        })
        .each(function (d) {
            d3.select(this)
                .attr('checked', true)
        });

    checkboxes.append('label')
        .attr('for', function (d) {
            return d.id.split(' ').join('_') + '_checkbox'
        })
        .text(function (d) {
            return d.id
        })
}


export function renderLineChart(country) {
    const g = utils.svg.append('g')
        .attr('id', 'line_chart')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    let data = [utils.getAllValuesForCountry(country)];
    create_domains(data);
    // drawGrid();
    drawAxis(g);
    drawLines(g, data);
    drawCheckboxes(data)
    mouseOver(g, data)
}


// const lineGraph_group = svg.append('g').attr('visibility', 'hidden');
//

//
//
// lineGraph_group.append("text")
//     .attr("class", "back_label")
//     .attr("transform", "translate(" + 1150 + "," + 30 + ")")
//     .attr("fill", "black")
//     .attr("text-anchor", "middle")
//     .attr("pointer-events", "none")
//     .text("Back");
//
//
//
// function lineChart() {
//     d3.csv("./Data/current.csv", function (error1, data1) {
//         d3.csv("./Data/predicted.csv", function (error2, data2) {
//             data1.forEach(function (d) {
//                 d.year = parseTime(d.year);
//                 d.score = +d.score;
//             });
//
//             data2.forEach(function (d) {
//                 d.year = parseTime(d.year);
//                 d.pessimistic = +d.pessimistic;
//                 d.optimistic = +d.optimistic;
//                 d.bau = +d.bau;
//             });
//
//             xScale = d3.scaleTime()
//                 .domain([
//                     d3.min(data1, function (d) {
//                         return d.year;
//                     }),
//                     d3.max(data2, function (d) {
//                         return d.year;
//                     })
//                 ])
//                 .range([padding + 100, width - 100]);
//
//             yScale = d3.scaleLinear()
//                 .domain([0, 5])
//                 .range([height - 40, padding]);
//
//             //Define axes
//             xAxis = d3.axisBottom()
//                 .scale(xScale)
//                 .ticks(10)
//                 .tickFormat(formatTime);
//
//             //Define Y axis
//             yAxis = d3.axisLeft()
//                 .scale(yScale)
//                 .ticks(5);
//
//             //Define line generators
//             line = d3.line()
//                 .defined(function (d) {
//                     return d.year >= parseTime(1960) && d.year <= parseTime(2015);
//                 })
//                 .x(function (d) {
//                     return xScale(d.year);
//                 })
//                 .y(function (d) {
//                     return yScale(d.score);
//                 });
//
//             pessimisticLine = d3.line()
//                 .defined(function (d) {
//                     return d.year >= parseTime(2015);
//                 })
//                 .x(function (d) {
//                     return xScale(d.year);
//                 })
//                 .y(function (d) {
//                     return yScale(d.pessimistic);
//                 });
//
//             optimisticLine = d3.line()
//                 .defined(function (d) {
//                     return d.year >= parseTime(2015);
//                 })
//                 .x(function (d) {
//                     return xScale(d.year);
//                 })
//                 .y(function (d) {
//                     return yScale(d.optimistic);
//                 });
//
//             bauLine = d3.line()
//                 .defined(function (d) {
//                     return d.year >= parseTime(2015);
//                 })
//                 .x(function (d) {
//                     return xScale(d.year);
//                 })
//                 .y(function (d) {
//                     return yScale(d.bau);
//                 });
//
//
//             //Draw predicted line
//             lineGraph_group.append("line")
//                 .attr("class", "line predicted")
//                 .attr("x1", xScale(parseTime(2015)))
//                 .attr("x2", xScale(parseTime(2015)))
//                 .attr("y1", padding)
//                 .attr("y2", height);
//
//             //Label predicted line
//             lineGraph_group.append("text")
//                 .attr("class", "predictedLabel")
//                 .attr("x", xScale(parseTime(2015)))
//                 .attr("y", padding)
//                 .text("Predicted");
//
//
//             //Create lines
//             lineGraph_group.append("path")
//                 .datum(data1)
//                 .attr("class", "line")
//                 .attr("d", line);
//
//
//             lineGraph_group.append("path")
//                 .datum(data2)
//                 .attr("class", "line pessimistic")
//                 .attr("d", pessimisticLine);
//
//             lineGraph_group.append("path")
//                 .datum(data2)
//                 .attr("class", "line optimistic")
//                 .attr("d", optimisticLine);
//
//             lineGraph_group.append("path")
//                 .datum(data2)
//                 .attr("class", "line bau")
//                 .attr("d", bauLine);
//
//             //Create axes
//             lineGraph_group.append("g")
//                 .attr("class", "axis")
//                 .attr("transform", "translate(0," + (height - padding) + ")")
//                 .call(xAxis);
//
//             lineGraph_group.append("g")
//                 .attr("class", "axis")
//                 .attr("transform", "translate(" + (padding + 100) + ",0)")
//                 .call(yAxis);
//
//         });
//     });
// }