//json
var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//pull data
d3.json(Url, function(data) {
  console.log(data.features)
  console.log(data.features[0].geometry.coordinates)


 //base layers (dark map and streetmap)
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  //light shade map
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // basemaps hold
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Light map": lightmap
  };

    //colors
    function getColor(d) {
      return d > 5 ? '#FF7E19' :
             d > 4 ? '#ffa705' :
             d > 3 ? '#e8af05' :
             d > 2 ? '#ffdb08' :
             d > 1 ? '#e8dd05' :
                     '#d2ff05';
    }

    // markers
    function markerSize(earthquake_mag) {
      return earthquake_mag * 5000;
    }

    var magMarkers = [];

    for (var i = 0; i < data.features.length; i++) {
      magMarkers.push(
        L.circle([+data.features[i].geometry.coordinates[1], +data.features[i].geometry.coordinates[0]], {
            //stroke: false,
            fillOpacity: 0.6,
            color: getColor(+data.features[i].properties.mag),
            fillColor: getColor(+data.features[i].properties.mag),
            radius: markerSize(+data.features[i].properties.mag)
        }).bindPopup("<p>Rating: " + data.features[i].properties.sig  + "</p> <p> Depth(km): " +  data.features[i].geometry.coordinates[2] + "</p> <p> Magnitude: " + data.features[i].properties.mag + "</p>")
      ) 
    }

    var earthquakeMag = L.layerGroup(magMarkers);

  // overlay
  var overlayMaps = {
    "Earthquake Magnitude": earthquakeMag,
  };

    // Define a map object
    var myMap = L.map("map", {
      center: [40, -90],
      zoom: 5,
      layers: [darkmap, earthquakeMag]
    });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);



    //legend
    var legend = L.control({position: 'bottomright'});



    legend.onAdd = function () {

      var div = L.DomUtil.create('div', 'info legend'),
      mags = [0, 1, 2, 3, 4, 5]

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < mags.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(mags[i] + 1)  + '"></i> ' +
                mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
        }

      return div;
    };

    legend.addTo(myMap);


});