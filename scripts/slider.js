import * as utils from "./index";
import {width, height, slider_height, slider_width, years, padding, water_stress_levels} from "./variables";
import {updateMap} from "./map";

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
            let keys = Object.keys(years);
            let current_year = years[keys.reverse().find(e => e <= utils.formatTime(val))];
            updateMap(water_stress_levels.get(current_year));
        });


    utils.svg.append('g')
        .attr('id', 'slider')
        .attr("transform", "translate(" + ((width / 2) - (slider_width / 2) + padding) + ", " + (height) + ")")
        .attr('width', slider_width)
        .attr('height', slider_height)
        .call(slider3);
}

