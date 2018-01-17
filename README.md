# meteorite-strike-d3

## Download the source data for meteorite strikes and world map
Download meteorite strike GeoJSON data from
[FreeCodeCamp](https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json)
Download world map countries data file from 
[Natural Earth](http://www.naturalearthdata.com/downloads/50m-cultural-vectors/)

## Prepare data using command-line tools
### Unzip
`unzip -o ne_50m_admin_0_countries.zip`

### Convert Shape file to GeoJSON
`npm install -g shapefile`
`shp2json ne_50m_admin_0_countries.shp -o ne_50m_admin_0_countries.json`

### Apply a Cylindrical Sterographic projection to the map and meteorites data files
`npm install -g d3-geo-projection`
```
geoproject 'd3.geoCylindricalStereographic()' \
< ne_50m_admin_0_countries.json \ 
> countries_scaled.json
```
```
geoproject 'd3.geoCylindricalStereographic()' \
< meteorites.json \ 
> meteorites_projected.json
```

### Install ndjson-cli
`npm install -g ndjson-cli`

### Convert map GeoJSON source file to a Newline Delimited JSON array of features
```
ndjson-split 'd.features' \
< countries_scaled.json \
> countries_scaled.ndjson
```

### Remove unwanted properties from the map data to leave just the country name
```
ndjson-map 'd.properties = {Country: d.properties.NAME }, d' \
< countries_scaled.ndjson \
> countries_only.ndjson
```

### Convert feature array back to a GeoJSON feature collection object 
```
ndjson-reduce \
< countries_only.ndjson \ 
 | ndjson-map '{type: "FeatureCollection", features: d}' \ 
 > countries_only.json
```

### Install TopoJson
`npm install -g topojson`

### Combine the meteorite stike data and the world map GeoJson data and convert to TopoJson format
```
geo2topo \ 
strikes=meteorites_projected.json \ 
world=countries_only.json \ 
> world-meteorite-strikes.json
```

## Present and style data in web page using D3, HTML and CSS

Set the map projection to d3.geoCylindricalStereographic
