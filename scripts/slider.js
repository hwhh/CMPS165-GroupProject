
import * as utils from "./index";
import {width, height, slider_height, slider_width, years, padding, water_stress_levels} from "./variables";
import {renderMap} from "./map";

export function createSlider() {

    const data3 =
        d3.range(0, Object.keys(years).length).map(function (d) {
            return new Date(Object.keys(years)[d], 10, 3);
        });

    const slider3 = d3.sliderHorizontal()
        .min(d3.min(data3))
        .max(d3.max(data3))
        .step(1000 * 60 * 60 * 24 * 365 * 5)
        .width(400)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(data3)
        .on('onchange', val => {
            d3.select('svg').selectAll('#map').remove();
            d3.select('svg').selectAll('#key').remove();
            let keys = Object.keys(years);
            let current_year = years[keys.reverse().find(e => e <= utils.formatTime(val))];
            renderMap(water_stress_levels.get(current_year))
        });


    utils.svg.append('g')
        .attr('id', 'slider')
        .attr("transform", "translate(" + ((width / 2) - (slider_width / 2) + padding) + ", " + (height) + ")")
        .attr('width', slider_width)
        .attr('height', slider_height)
        .call(slider3);


}

//var data3 = d3.range(0, 10).map(function (d) { return new Date(1995 + d, 10, 3); });
//
//  var slider3 = d3.sliderHorizontal()
//    .min(d3.min(data3))
//    .max(d3.max(data3))
//    .step(1000 * 60 * 60 * 24 * 365)
//    .width(400)
//    .tickFormat(d3.timeFormat('%Y'))
//    .tickValues(data3)
//    .on('onchange', val => {
//      d3.select("p#value3").text(d3.timeFormat('%Y')(val));
//    });
//
//  var g = d3.select("div#slider3").append("svg")
//    .attr("width", 500)
//    .attr("height", 100)
//    .append("g")
//    .attr("transform", "translate(30,30)");
//
//  g.call(slider3);
//
//  d3.select("p#value3").text(d3.timeFormat('%Y')(slider3.value()));
//  d3.select("a#setValue3").on("click", () => slider3.value(new Date(1997, 11, 17)));
