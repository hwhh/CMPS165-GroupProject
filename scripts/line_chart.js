import * as utils from "./index";
import {width, height, margin, display_country} from "./variables";
import {water_stress_bau} from "./index";


//Sets axis scales
const x = d3.scaleTime().range([0, width - 100]),
    y = d3.scaleLog().base(Math.E).domain([0.0015, 1000]).range([height, 0]),
    // y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

//Line generator, where the lives are curved
const line = d3.line()
// .curve(d3.curveBasis)
    .x(function (d) {
        return x(new Date(d.date))
    })
    .y(function (d) {
        if (d.value === undefined)
            return -1;
        else
            return y(d.value)
    });

// Define the div for the tooltip
const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


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

//https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
function mouseOver(g, countries) {

    console.log(countries)
    //Add new element to the DOM
    const mouseG = g.append('g')
        .attr('class', 'mouse-over-effects');

    //This is the black vertical line to follow mouse
    mouseG.append('path')
        .attr('class', 'mouse-line')
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        // .attr('transform', 'translate(' + (width + 40) + ',' + (20) + ')')
        // .attr('dy', '0.71em')
        .style('opacity', '0');

    //Get all the lines in the DOM
    const lines = document.getElementsByClassName('line');

    //Adds new elements to the DOM for each country
    const mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(countries)
        .enter()
        .append('g')
        .attr('class', 'country mouse-per-line')
        // .attr('transform', 'translate(' + 0 + ',' +  + ')')
        .attr('id', function (d) {
            return d.id.split(' ').join('_')
        });

    //Adds circles on visible lines
    mousePerLine.append('circle')
        .attr('r', 7)
        .style('stroke', function (d) {
            return z(d.id)
        })
        // .attr('transform', 'translate(' + 0 + ',' + 175+ ')')
        .style('fill', 'none')
        .style('stroke-width', '1px')
        .style('opacity', '0')
        .style('visibility', 'hidden')
        .filter(function (d) { //Only shows the circles for selected countries
            return d.display
        })
        .style('visibility', 'visible');

    //Adds text next to the circles for visible lines which show the current value
    mousePerLine.append('text')
        .attr('transform', 'translate(10,3)')
        .style('font', '12px sans-serif')
        .style('visibility', 'hidden')
        .filter(function (d) { //Only shows the values for selected countries
            return d.display
        })
        .style('visibility', 'visible');

    mouseG.append('svg:rect') //Append a rect to catch mouse movements on canvas
        .attr('width', width) //Can't catch mouse events on a g element
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
                    let pos = -1;
                    const xDate = x.invert(mouse[0]),
                        bisect = d3.bisector(function (d) {
                            return d.date
                        }).right;
                    bisect(d.values, xDate);

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

function drawLines(g, countries, key) {

    //Add new element to the DOM for each country
    const country = g.selectAll(key)
        .data(countries)
        .enter().append('g')
        // .attr('class', 'country')
        .attr('id', function (d) {
            return d.id.split(' ').join('_')
        }).on("mouseover", function (d) {
            console.log(d)
            // d3.selectAll('path').style('opacity', '0.3');
            // d3.selectAll('path').selectAll('#'+d.id).style('opacity', '1');
        }).on("mouseout", function (d) {
            // d3.selectAll('path').style('opacity', '1');
            // d3.selectAll('#' + d.id).style('opacity', '1');
        }).style('pointer-events', 'none');

    country.append('path')
        .attr('class', 'line')
        .attr('d', function (d) {
            return line(d.values) // uses the line generator
        })
        .attr('fill', 'none')
        .style('stroke', function (d) {
            return z(d.id)
        });

    country.append('path')
        .attr('class', 'fat_line')
        .attr('d', function (d) {
            return line(d.values) // uses the line generator
        })
    // .style('fill', 'transparent')
    // .style('stroke', 'invisible')
        .style('stroke-width', 10);
    // .attr('fill', 'none')


    // gEnter = link.enter()
    //     .append('g')
    //     .attr('class', 'link')
    //     .on('mouseover', function(d) {
    //         //alert(JSON.stringify(d));
    //         alert('mouseover');
    //     }).on('mouseout', function(d) {
    //         alert('mouseout');
    //     });
    //
    // // Instead of 1 line, append 2 lines inside the g, and make
    // // one of them transparent and "fat", which will enlarge the
    // // hit area
    // let lines = country
    //     .selectAll('.path').data(['visible', 'invisible']);
    // lines.enter()
    //     .append('line')
    //     .attr('class', 'path')
    //     .attr('marker-end', function (d, i, j) {
    //         // j is the parent's i
    //         if (j === 2) {
    //             return 'url(#arrow)';
    //         } else {
    //             return null;
    //         }
    //     })
    //     .attr({
    //         // returning null from these functions simply defaults to whatever the
    //         // .path class's CSS props are doing
    //         'stroke-width': function (d, i) {
    //             return d == 'invisible' ? 10 : null
    //         },
    //         'stroke': function (d, i) {
    //             return d == 'invisible' ? 'transparent' : null
    //         }
    //     })

    // lineGraph_group.append("path")
    //     .datum(data2)
    //     .attr("class", "line pessimistic")
    //     .attr("d", pessimisticLine);
    //
    // lineGraph_group.append("path")
    //     .datum(data2)
    //     .attr("class", "line optimistic")
    //     .attr("d", optimisticLine);
    //
    // lineGraph_group.append("path")
    //     .datum(data2)
    //     .attr("class", "line bau")
    //     .attr("d", bauLine);


    country.selectAll(".dot")
        .data(function (d) {
            return d.values
        })
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("cx", function (d, i) {
            return x(new Date(d.date));
        })
        .attr("cy", function (d) {
            return y(d.value);
        })
        .attr("fill", function (d) {
            return z(d3.select(this.parentNode).datum().id);
        })
        .attr("date", function (d) {
            return (d.date)
        })
        .attr("val", function (d) {
            return (d.value)
        })
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);

            div.html(d3.select(this).attr("date") + "<br/>" + d3.select(this).attr("val"))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .style('opacity', '0')
        .filter(function (d) { //Only shows the circles for selected countries
            return display_country[d3.select(this.parentNode).datum().id].display
        })
        .style('opacity', '1');

    // //Adds the country name at the end of the line
    // country.append('text')
    //     .datum(function (d) { //Allows the binding of country data to multiple SVG elements
    //         return {id: d.id, display: d.display, value: d.values[d.values.length - 1]}
    //     })
    //     .attr('transform', function (d) {
    //         return 'translate(' + x(d.value.date) + ',' + y(d.value.energy) + ')'
    //     })
    //     .attr('x', 3)
    //     .attr('dy', '0.35em')
    //     .style('font', '10px sans-serif')
    //     .text(function (d) {
    //         return d.id
    //     })
    //     .style('text-anchor', 'start')
    //     .style('opacity', 0)
    //     .filter(function (d) { //Only shows the country names for selected countries
    //         return d.display
    //     })
    //     .transition()
    //     .duration(2000)
    //     .style('opacity', 1);
    //

    const paths = country.select('path')
        .each(function () {
            d3.select(this)
                .attr('stroke-dasharray', this.getTotalLength() + ',' + this.getTotalLength())
                .attr('stroke-dashoffset', '' + this.getTotalLength())

        });
    paths.filter(function (d) { // only shows the lines for selected countries
        return display_country[d.id].display
    })
        .transition()
        .duration(2000)
        .attrTween('stroke-dashoffset', tweenDashoffsetOn)

}

function drawAxis(g) {
    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        .append('text')
        .attr('transform', 'translate(' + (width - 60) + ',' + (30) + ')')
        .attr('fill', '#000')
        .text('Year');

    g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).tickFormat(d3.format(",.2f")).tickValues([0.00001, 0.0078125, 0.015625, 0.03125, 0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 500]))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('fill', '#000');


    g.append("text")
        .attr("class", "predictedLabel")
        .attr("x", x(utils.parseTime(2017)))
        .text("Predicted");

    g.append("line")
        .attr("class", "line predicted")
        .attr("x1", x(utils.parseTime(2017)))
        .attr("x2", x(utils.parseTime(2017)))
        .attr("y1", 0)
        .attr("y2", height + 10);

    // //Adds the y axis title
    // g.append('text')
    //     .attr('font-family', 'Sans-serif')
    //     .attr('font-size', '0.8em')
    //     .attr('transform', 'rotate(-90)')
    //     .attr('x', 0 - (height / 2))
    //     .attr('dy', '1em')
    //     .style('text-anchor', 'middle')
    //     .text('Million BTUs Per Person')
}

//TODO Update domains
function create_domains(data) {
    x.domain([utils.parseTime('1982'), utils.parseTime('2040')]);
    y.domain([
        d3.min(data, function (c) {
            return d3.min(c.values, function (d) {
                return d.value
            })
        }),
        d3.max(data, function (c) {
            return d3.max(c.values, function (d) {
                return d.value
            })
        })
    ]);
    z.domain(data.map(function (c) {
        return c.id
    }))

    // x.domain([parseTime('2000'), parseTime('2010')])
    // //https://bl.ocks.org/mbostock/3884955
    // y.domain([
    //     d3.min(countries, function (c) { return d3.min(c.values, function (d) { return d.energy }) }),
    //     d3.max(countries, function (c) { return d3.max(c.values, function (d) { return d.energy }) })
    // ])
    // z.domain(countries.map(function (c) {
    //     return c.id
    // }))
}

//TODO  send in the countries for updating
export function updateChart() {
    Object.keys(display_country).forEach(function (key) {
        const g = d3.selectAll('#' + key);
        if (display_country[key].display) {
            g.select('text')
                .transition()
                .duration(1000)
                .style('opacity', 1);
            g.select('path').style('opacity', '1');
            g.select('path').transition()
                .duration(2000)
                .attrTween('stroke-dashoffset', tweenDashoffsetOn);

            g.select('circle').transition()
                .duration(2000)
                .attrTween('stroke-dashoffset', tweenDashoffsetOn);

            g.selectAll('circle').style('opacity', '1').style('pointer-events', 'auto');
            g.style('pointer-events', 'auto');

            // //Select elements deeper in the DOM
            // d3.select('.mouse-over-effects').select('#' + key).selectAll('circle')
            //     .style('visibility', 'visible');
            // d3.select('.mouse-over-effects').select('#' + key).selectAll('text')
            //     .style('visibility', 'visible')
        } else {
            g.selectAll('circle').style('opacity', '0').style('pointer-events', 'none');
            g.style('pointer-events', 'none');
            g.select('text').style('opacity', '0');
            g.select('path').style('opacity', '0');
            //Select elements deeper in the DOM
            // d3.select('.mouse-over-effects').select('#' + key).selectAll('circle')
            //     .style('visibility', 'hidden');
            // d3.select('.mouse-over-effects').select('#' + key).selectAll('text')
            //     .style('visibility', 'hidden')
        }
    });
}

// function mouseOverEffect() {
//     this.classList.add("bar-highlight");
// }
// function mouseOutEffect() {
//     this.classList.remove("bar-highlight");
// }

export function renderLineChart() {
    const g = utils.svg.append('g')
        .attr('id', 'line_chart')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    create_domains(utils.water_stress);
    drawAxis(g);
    console.log(utils.water_stress);
    drawLines(g, utils.water_stress, '.country');
    drawLines(g, utils.water_stress_bau, '.country_bau');
    drawLines(g, utils.water_stress_opt, '.country_opt');
    drawLines(g, utils.water_stress_pst, '.country_pst');

    // const lines = document.getElementsByClassName('path');
    // for (let i = 0; i < lines.length; i++) {
    //     lines[i].addEventListener('mouseover', mouseOverEffect);
    //     lines[i].addEventListener('mouseout', mouseOutEffect);
    // }

    // mouseOver(g, utils.water_stress);
}


