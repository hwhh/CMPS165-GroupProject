let width = 1200,
    height = 600;

var world_map, slider;

const projection = d3.geoMercator()
    .scale(100)
    .translate([width / 2, height / 2.5]);

const path = d3.geoPath()
    .projection(projection);

const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height+50);

const color = d3.scaleThreshold()
    .domain([1,2,3,4,5,6,7,8,9])
    .range(d3.schemeBlues[7]);

// creates a group for the linegraph and creates a toggle button 
var lineGraph_group = svg.append('g').attr('visibility', 'hidden');
var back2Map_button = lineGraph_group.append("rect")
                .attr("class", "back2Map_button")
                .attr("transform", "translate(" + 1100 + "," + 0 + ")")
                .attr('width', 100)
                .attr('height',50)
                .attr('fill', 'lightblue')
                .on('click', function(){
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
                

var padding = 40;

var xScale, yScale, xAxis, yAxis;  //Empty, for now

//For converting Dates to strings
var formatTime = d3.timeFormat("%Y");

//Function for converting CSV values from strings to Dates and numbers
var parseTime = d3.timeParse("%Y");

function renderMap() {
    d3.json('world.geojson', function (error, mapData) {
        const features = mapData.features;
        world_map = svg.append('g')
            .attr('class', 'countries')
            .style('display', 'block')
            .selectAll('path')
            .data(features)
            .enter().append('path')
            .attr('d', path)
            .style('fill', function (d) {
                return color(Math.floor(Math.random() * 10) + 1);
            })
            .on("mouseover", function(d){
                let country_name = d.properties.ADMIN;
                //console.log(country_name);
                
                //defines the color change on hover
                d3.select(this)
                    .style("fill", "orange");
            })
            .on("mouseout", function(d){
                d3.select(this).style("fill", function(d){
                        let country_name = d.properties.ADMIN;
                        //console.log(country_name);
                        return color(Math.floor(Math.random() * 10) +1);
                    });
            })
            .on("click", function(d){
                let country_name = d.properties.ADMIN;
                console.log("clicked: " + country_name);
                toggle_lineChart_visibility();
            })
            
    });
}

renderMap();

function toggle_lineChart_visibility(){
    // Hide the world map and let the line graph be visible
    world_map.attr('visibility', 'hidden');
    slider.attr('visibility', 'hidden');
    lineGraph_group.attr('visibility', 'visibile');
}

function lineChart(){
    
    d3.csv("current.csv", function(error1, data1){

        d3.csv("predicted.csv", function(error2, data2){

            data1.forEach(function(d) {
                d.year = parseTime(d.year);
                d.score = +d.score;
            });

            data2.forEach(function(d) {
                d.year = parseTime(d.year);
                d.pessimistic = +d.pessimistic;
                d.optimistic = +d.optimistic;
                d.bau = +d.bau;
            });

            xScale = d3.scaleTime()
                       .domain([
                            d3.min(data1, function(d) { return d.year; }),
                            d3.max(data2, function(d) { return d.year; })
                        ])
                       .range([padding+100, width-100]);

            yScale = d3.scaleLinear()
                        .domain([0,5])
                        .range([height-40, padding]);                

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
                        .defined(function(d) { return d.year >= parseTime(1960) && d.year <= parseTime(2015); })
                        .x(function(d) { return xScale(d.year); })
                        .y(function(d) { return yScale(d.score); });

            pessimisticLine = d3.line()
                        .defined(function(d) { return d.year >= parseTime(2015); })
                        .x(function(d) { return xScale(d.year); })
                        .y(function(d) { return yScale(d.pessimistic); });

            optimisticLine = d3.line()
                        .defined(function(d) { return d.year >= parseTime(2015); })
                        .x(function(d) { return xScale(d.year); })
                        .y(function(d) { return yScale(d.optimistic); });

            bauLine = d3.line()
                        .defined(function(d) { return d.year >= parseTime(2015); })
                        .x(function(d) { return xScale(d.year); })
                        .y(function(d) { return yScale(d.bau); });


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
                .attr("transform", "translate(" + (padding+100) + ",0)")
                .call(yAxis);
            
        });
    });
}

lineChart();
//---------------------------------------------------------------

const x = d3.scaleLinear()
    .domain([1960, 2040])
    .range([0, 600])
    .clamp(true);

slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + 300 + "," + 600 + ")");


slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(10))
    .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; });

const handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

//slider.transition() // Gratuitous intro!
//    .duration(750)
//    .tween("hue", function() {
//      var i = d3.interpolate(0, 70);
//      return function(t) { hue(i(t)); };
//    });

//function hue(h) {
//  handle.attr("cx", x(h));
//  svg.style("background-color", d3.hsl(h, 0.8, 0.8));
//}

