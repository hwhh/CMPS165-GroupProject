
/**
 * TOTAL WATER STRESS LEVEL
 * [SDG 6.4.2. Water Stress] = 100*[Total freshwater withdrawal (primary and secondary)]/([Total renewable water resources]-[Environmental Flow Requirements])
 *
 */

const years = ['1978-1982', '1983-1987', '1988-1992', '1993-1997', '1998-2002', '2003-2007', '2008-2012', '2013-2017'];

// const x = d3.scaleLinear()
//     .domain([1960, 2040])
//     .range([0, 600])
//     .clamp(true);

const projection = d3.geoMercator()
    .scale(100)
    .translate([width / 2, height / 2.5]);

const path = d3.geoPath()
    .projection(projection);

const color = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range(d3.schemeBlues[7]);


export function renderMap(data) {
    d3.json('./Data/world.geojson', function (error, mapData) {
        const features = mapData.features;
        svg.append('g')
            .attr('id', 'map')
            .attr('class', 'countries')
            .style('display', 'block')
            .selectAll('path')
            .data(features)
            .enter().append('path')
            .attr('d', path)
            .style('fill', function (d) {
                // return color(data.get());
                return color(Math.floor(Math.random() * 10) + 1);
            })
            .on("mouseover", function (d) {
                let country_name = d.properties.ADMIN;
                //console.log(country_name);

                //defines the color change on hover
                d3.select(this)
                    .style("fill", "orange");
            })
            .on("mouseout", function (d) {
                d3.select(this).style("fill", function (d) {
                    let country_name = d.properties.ADMIN;
                    //console.log(country_name);
                    return color(Math.floor(Math.random() * 10) + 1);
                });
            })
            .on("click", function (d) {
                let country_name = d.properties.ADMIN;
                console.log("clicked: " + country_name);
                toggle_lineChart_visibility();
            })

    });
}

