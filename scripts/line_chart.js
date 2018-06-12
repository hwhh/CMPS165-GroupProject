import * as utils from "./index";
import {width, height, margin, display_country} from "./variables";


const formatDecimal = d3.format(".3f");

var bisectDate = d3.bisector(function (d) {
    return d.date;
}).left;


//Sets axis scales
const x = d3.scaleTime().range([0, width - 100]),
    y = d3.scaleLog().base(Math.E).domain([0.0015, 1000]).range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);


//Line generator, where the lives are curved
const line = d3.line()
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


function tweenDashoffsetOn() {
    const l = this.getTotalLength(),
        i = d3.interpolateString('' + l, '0');
    return function (t) {
        return i(t)
    }
}


function drawLines(g, countries, key) {
    const country = g.selectAll(key)
        .data(countries)
        .enter().append('g')
        .attr('class', 'country')
        .attr('id', function (d) {
            return d.id.split(' ').join('_')
        }).on("mouseover", function (data) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            const circleUnderMouse = this;
            d3.selectAll('.country').style('opacity', function () {
                return (this.id === circleUnderMouse.id) ? 1.0 : 0.2;
            });
            d3.selectAll('.country').select('.line')
                .style('stroke-width', '1px')
                .filter(function (d) {
                    return d.id === circleUnderMouse.id
                })
                .style('stroke-width', '2px')
        }).on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            d3.selectAll('.country').style('opacity', '1');
            d3.selectAll('.country').select('.line').style('stroke-width', '1px')

        }).on("mousemove", function (data) {
            // console.log(data);
            // console.log((y.invert(d3.mouse(this)[1] - 2)));
            // console.log(utils.formatTime((x.invert(d3.mouse(this)[0]))));
            div.html('Country: ' +data.id + '<br/>' +
                'Year: ' + utils.formatTime(x.invert(d3.mouse(this)[0])) + '<br/>' +
                'Value:' + formatDecimal(y.invert(d3.mouse(this)[1] - 2)) + '<br/>'
            )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .style('pointer-events', 'none');


    country.append('path')
        .attr('class', 'line')
        .attr('d', function (d) {
            return line(d.values)
        })
        .attr('fill', 'none')
        .style('stroke', function (d) {
            return z(d.id)
        });

    country.append('path')
        .attr('class', 'fat_line')
        .attr('d', function (d) {
            return line(d.values)
        })
        .style('stroke-width', 20);


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
        .style('opacity', '0')
        .filter(function (d) { //Only shows the circles for selected countries
            return display_country[d3.select(this.parentNode).datum().id].display
        })
        .style('opacity', '1');


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

}

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

}

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
        } else {
            g.selectAll('circle').style('opacity', '0').style('pointer-events', 'none');
            g.style('pointer-events', 'none');
            g.select('text').style('opacity', '0');
            g.select('path').style('opacity', '0');
        }
    });
}


export function renderLineChart() {
    const g = utils.svg.append('g')
        .attr('id', 'line_chart')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    create_domains(utils.water_stress);
    drawAxis(g);
    drawLines(g, utils.water_stress, '.country');
    drawLines(g, utils.water_stress_bau, '.country_bau');
    drawLines(g, utils.water_stress_opt, '.country_opt');
    drawLines(g, utils.water_stress_pst, '.country_pst');


    updateChart();
}


