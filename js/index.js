var width = 960;
var height = 560;

var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-5,25])
    .html(function(d) { return "<span>Name: " + d.properties.name + "</span>" 
                            + "<br/><span>Mass: " + d.properties.mass + "</span>"
                            + "<br/><span>Year: " + new Date(Date.parse(d.properties.year)).getFullYear() + "</span>"; })

var projection = d3.geoCylindricalStereographic();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath(projection);

var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

function zoom_actions() {
    g.attr("transform", d3.event.transform);
}

zoom_handler(svg);

var g = svg.append("g")
    .call(tip);

var radius = d3.scaleSqrt()
    .domain([0, 1e6])
    .range([0, 10]);

var rainbow = d3.scaleSequential(d3.interpolateRainbow)
    .domain([0, 1000000]);

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
        .attr("fill", (d) => rainbow(parseInt(d.properties.mass)))
    .on("mouseover", function(d, i) {
        tip.show(d, svg)
     })
    .on("mouseout", tip.hide);
});
