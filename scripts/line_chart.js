const lineGraph_group = svg.append('g').attr('visibility', 'hidden');

const back2Map_button = lineGraph_group.append("rect")
    .attr("class", "back2Map_button")
    .attr("transform", "translate(" + 1100 + "," + 0 + ")")
    .attr('width', 100)
    .attr('height', 50)
    .attr('fill', 'lightblue')
    .on('click', function () {
        // toggle visibility
        d3.select('svg').select('#map').transition().duration(1000).style('display', 'block');
        d3.select('svg').select('#slider').transition().duration(1000).style('display', 'block');
        lineGraph_group.attr('visibility', 'hidden');
    });


lineGraph_group.append("text")
    .attr("class", "back_label")
    .attr("transform", "translate(" + 1150 + "," + 30 + ")")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("pointer-events", "none")
    .text("Back");



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