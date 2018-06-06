const slider_width = 500, slider_height = 100;


function createSlider() {

    const data3 = d3.range(0, 10).map(function (d) {
        return new Date(1995 + d, 10, 3);
    });

    const slider3 = d3.sliderHorizontal()
        .min(d3.min(data3))
        .max(d3.max(data3))
        .step(1000 * 60 * 60 * 24 * 365)
        .width(400)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(data3)
        .on('onchange', val => {
            d3.select("p#value3").text(d3.timeFormat('%Y')(val));
        });

    svg.append('g')
        .attr('id', 'slider')
        .attr("transform", "translate(" + ((width / 2) - (slider_width / 2) + padding) + ", " + (height) + ")")
        .attr('width', slider_width)
        .attr('height', slider_height)
        .call(slider3);


    d3.select("p#value3").text(d3.timeFormat('%Y')(slider3.value()));
    d3.select("a#setValue3").on("click", () => slider3.value(new Date(1997, 11, 17)));

}