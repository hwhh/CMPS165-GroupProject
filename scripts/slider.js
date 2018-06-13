import * as utils from "./index";
import {width, height, slider_height, slider_width, years, padding} from "./variables";
import {updateMap, futureOptions, bau, optimistic, pessimistic} from "./map";

export function createSlider() {

    const data3 =
        d3.range(0, Object.keys(years).length).map(function (d) {
            return new Date(Object.keys(years)[d], 10, 3);
        });

    const slider3 = d3.sliderHorizontal()
        .min(d3.min(data3))
        .max(d3.max(data3))
//        .step(1000 * 60 * 60 * 24 * 365 * 5)
        .width(400)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(data3)
        .on('onchange', val => {
            d3.select('svg').select('#key').remove();
            let keys = Object.keys(years);
            let current_year = years[keys.reverse().find(e => e <= utils.formatTime(val))];
            if(current_year === "2020" || current_year === "2030" || current_year === "2040"){
                d3.select('svg')
                    .select('#slider')
                    .select('.slider')
                    .select('.parameter-value')
                    .select('path')
                    .style('fill', '#8b0000');
                
                document.getElementById("bau").disabled=false;
                document.getElementById("optimistic").disabled=false;
                document.getElementById("pessimistic").disabled=false;
                
                updateMap(utils.water_stress_levels_bau.get(current_year));
                
                bau(utils.water_stress_levels_bau.get(current_year));
                optimistic(utils.water_stress_levels_opt.get(current_year));
                pessimistic(utils.water_stress_levels_pst.get(current_year));
                
            
                
            }
            else{
                d3.select('svg')
                    .select('#slider')
                    .select('.slider')
                    .select('.parameter-value')
                    .select('path')
                    .style('fill', 'white');
                
                document.getElementById("bau").disabled=true;
                document.getElementById("optimistic").disabled=true;
                document.getElementById("pessimistic").disabled=true;
                
                updateMap(utils.water_stress_levels.get(current_year));
                
            }
        });


    utils.svg.append('g')
        .attr('id', 'slider')
        .attr("transform", "translate(480" + ", " + (height) + ")")
        .attr('width', slider_width)
        .attr('height', slider_height)
        .call(slider3);
    
    utils.svg.append('g').append("text")
        .attr("class", "predictedSliderLabel")
        .attr("x", 750)
        .attr("y", 580)
        .text("Predicted");
    
    utils.svg.append('g').append("line")
        .attr("class", "predicted")
        .attr("x1", 750)
        .attr("x2", 750)
        .attr("y1", 620)
        .attr("y2", 580);

    
}

