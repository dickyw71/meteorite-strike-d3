# meteorite-strike-d3

## Prepare data using command-line tools
Locate and download world map countries data file from 
[Natural Earth](http://www.naturalearthdata.com/downloads/50m-cultural-vectors/)
### Unzip
`unzip -o ne_50m_admin_0_countries.zip`

### Convert Shape file to GeoJSON
`shp2json ne_50m_admin_0_countries.shp -o ne_50m_admin_0_countries.json`

### Convert GeoJSON to Newline Delimited JSON array of features
```
ndjson-split 'd.features' \
< ne_50m_admin_0_countries.json \
> ne_50m_admin_0_countries.ndjson
```

### Remove unwanted properties to leave just the country name
```
ndjson-map 'd.properties = {Country: d.properties.NAME }, d' \
< ne_50m_admin_0_countries.ndjson \
> ne_50m_admin_0_countries_only.ndjson
```

### Load the meteorite stike data and combine with to the map data
ndjson-cat 

### Convert feature array back to a GeoJSON feature collection object
```
ndjson-reduce 
```

### Convert to TopoJson format
```
geo2topo
```

## Present and style data in web page using D3, HTML and CSS

Set the map projection to d3.geoCylindricalStereographic
