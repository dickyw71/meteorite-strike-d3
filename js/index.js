var width = parseInt(d3.select('.svg-container').style("width")),
    height = 600;

var parseTime = d3.timeParse("%B %d, %Y");

var meteoriteTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) { return "<span>Name: " + d.properties.name + "</span>" 
                            + "<br/><span>Mass: " + d.properties.mass + "</span>"
                            + "<br/><span>Year: " + new Date(Date.parse(d.properties.year)).getFullYear() + "</span>"; })

var countryTip = d3.tip()
    .attr("class", "d3-tip")
    .html((d) => "<span>" + d.properties.Country + "</span>");                        

var projection = d3.geoCylindricalStereographic()
    .scale(150);

var svg = d3.select(".world-map")
    .attr("width", width)
    .attr("height", height)
    .attr("class", ".world-map");

var path = d3.geoPath(projection);

var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

function zoom_actions() {
    g.attr("transform", d3.event.transform);
}

zoom_handler(svg);

var g = svg.append("g")
    .attr("transform", "translate(" + 0 + "," + 50 + ")")
    .call(countryTip)
    .call(meteoriteTip);

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
      .attr("d", path)
    .on("mouseover", function(d, i) {
        countryTip.show(d, svg)
     })
    .on("mouseout", countryTip.hide);

    g.selectAll(".strike")
    .data(topology.objects.strikes.geometries.sort((a, b) => b.properties.mass - a.properties.mass))
    .enter()
        .append("path")
        .attr("class", "strike")
        .attr("d", path.pointRadius((d) => radius(d.properties.mass)))
        .attr("fill", (d) => rainbow(parseInt(d.properties.mass)))
    .on("mouseover", function(d, i) {
        meteoriteTip.show(d, svg)
     })
    .on("mouseout", meteoriteTip.hide);
});
