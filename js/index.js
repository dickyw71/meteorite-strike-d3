var width = 1100;
var height = 960;

var projection = d3.geoNaturalEarth1();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath(projection);

var g = svg.append("g");

var radius = d3.scaleSqrt()
    .domain([0, 1e6])
    .range([0, 10]);

var rainbow = d3.scaleSequential(d3.interpolateRainbow);

d3.json("strikes-map.json", function(error, topology) {

    g.selectAll(".map")
    .data(topojson.feature(topology, topology.objects.world).features)
    .enter()
      .append("path")
      .attr("class", "map")
      .attr("d", path);

    g.selectAll(".strike")
    .data(topology.objects.strikes.geometries.sort((a, b) => b.properties.mass - a.properties.mass))
    .enter()
        .append("path")
        .attr("class", "strike")
        .attr("d", path.pointRadius((d) => radius(d.properties.mass)))
        .attr("fill", (d) => rainbow(parseInt(d.properties.mass)));
});