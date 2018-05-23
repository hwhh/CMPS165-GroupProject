let width = 960,
    height = 500;

const projection = d3.geoAlbers()
    .center([0, 0])
    // .rotate([4.4, 0])
    // .parallels([50, 60])
    .scale(100)
    // .translate([width / 2, height / 2]);

const path = d3.geoPath()
    .projection(projection);

const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

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
            });
    });
}

renderMap();