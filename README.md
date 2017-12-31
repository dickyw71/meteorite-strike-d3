# meteorite-strike-d3

Locate and download world map countries data file from 
[Natural Earth](http://www.naturalearthdata.com/downloads/50m-cultural-vectors/)
## Unzip
`unzip -o ne_50m_admin_0_countries.zip`

## Convert Shape file to GeoJSON
`shp2json ne_50m_admin_0_countries.shp -o ne_50m_admin_0_countries.json`

## Convert GeoJSON to Newline Delimited GeoJSON
```
ndjson-split 'd.features' \
< ne_50m_admin_0_countries.json \
> ne_50m_admin_0_countries.ndjson
```

## Remove unwanted data attributes
```
ndjson-map 'd.properties = {Country: d.properties.NAME }, d' \
< ne_50m_admin_0_countries.ndjson \
> ne_50m_admin_0_countries_only.ndjson
```

define map area

Load world map data from http://bl.ocks.org/mbostock/raw/4090846/world-110m.json

set the projection ?

Load the meteorite stike data and combine with to the map data

CLI

