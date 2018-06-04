let width = 1200,
    height = 600;

const years = [1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,]

let total_internal_water = new Map();
let total_external_water = new Map();
let total_available_water = new Map();
let total_water_used = new Map();
let water_stress_levels = new Map();


/**
 * TOTAL WATER STRESS LEVEL
 * For each country Find
 * Water Stress as a % = X = Total Water Used / Total Water (Total Internal + Total External)
 * Find max(X)
 * Divide each country by max(X) and multiply by 5
 */


const projection = d3.geoMercator()
    .scale(100)
    .translate([width / 2, height / 2.5]);

const path = d3.geoPath()
    .projection(projection);

const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height + 50);

const color = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
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
    .select(function () {
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-inset")
    .select(function () {
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function () {
            slider.interrupt();
        })
        .on("start drag", function () {
            hue(x.invert(d3.event.x));
        }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(10))
    .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function (d) {
        return d;
    });

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


//Map = Country -> {Year, Value}

function loadDataset(map, file) {
    return new Promise((resolve, reject) => {
        d3.csv(file, function (data) {
            data.forEach(function (d) {
                let values = map.get(d.Area);
                if (values === undefined) {
                    values = {}
                }
                values[d.Year] = +d.Value;
                map.set(d.Area, values)
            });
            resolve();
        });
    });
}

function calculateScore() {
    let max = -1;
    _.union(Array.from(total_internal_water.keys()), Array.from(total_external_water.keys())).forEach(function (key) {
        let external = total_external_water.get(key);
        let internal = total_internal_water.get(key);
        let withdraws = total_internal_water.get(key);
        if (external === undefined)
            external = {};
        if (internal === undefined)
            internal = {};
        if (withdraws === undefined)
            internal = {};
        years.forEach(function (year) {
            let values = total_available_water.get(year);
            if (values === undefined) {
                values = {}
            }
            let external_value = external[year];
            let internal_value = internal[year];
            let withdrawn_value = internal[year];
            if (withdrawn_value === undefined || external_value === undefined || internal_value === undefined)
                values[key] = "No Data";
            else
                values[key] = withdrawn_value / (external_value + internal_value);
                if(values[key] > max)
                    max = values[key];
            total_available_water.set(year, values)

        });
    });
    Array.from(total_available_water.keys()).forEach(function (key) {
        total_available_water.get(key)
        _.union(Array.from(total_internal_water.keys()), Array.from(total_external_water.keys())).forEach(function (key) {


        })
    })
}


Promise.all([
    loadDataset(total_external_water, 'external.csv'),
    loadDataset(total_internal_water, 'internal.csv'),
    loadDataset(total_water_used, 'withdrawals.csv')
]).then(values => {


    calculateScore();
    renderMap();
});






