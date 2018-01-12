var margin = 50,
width = parseInt(d3.select('.world-map').style("width")) - margin*2,
height = 600 - margin*2;

var parseTime = d3.timeParse("%B %d, %Y");

var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-5,25])
    .html(function(d) { return "<span>Name: " + d.properties.name + "</span>" 
                            + "<br/><span>Mass: " + d.properties.mass + "</span>"
                            + "<br/><span>Year: " + new Date(Date.parse(d.properties.year)).getFullYear() + "</span>"; })

var projection = d3.geoCylindricalStereographic();

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

// svg.append("text")
//     .attr("class", "map-title")
//     .style("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
//     .attr("transform", "translate(" + width/2 + ","+ margin*0.5 +")")  // centre in top margin
//     .text("Meteorite strikes plotted across the globe");

var g = svg.append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
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
