let width = 1200,
    height = 600;


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

function renderMap() {
    d3.json('world.geojson', function (error, mapData) {
        const features = mapData.features;
        svg.append('g')
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
            })
            
    });
}

renderMap();

const x = d3.scaleLinear()
    .domain([1960, 2040])
    .range([0, 600])
    .clamp(true);

const slider = svg.append("g")
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

