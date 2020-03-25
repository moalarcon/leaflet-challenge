//// Get Data for earthquakes and fault lines; create map features////

// Store API query variables
var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


// Create variables to store data
var earthquakeData;
// var tectonicData;
// var plates;
var earthQuakes;
// var myMap;

// GET request for tectonic and earthquake URL using d3

////Tectonic Plates Data////
d3.json(tectonicURL, function (response) {
  var tectonicData = response;
  // create layer and pass style parameters into Plates variable
  var plates = L.geoJSON(tectonicData, {
    onEachFeature: onEachFault
  });

  //// Earthquake Data////
  // GET request for earthquake URL using d3
  d3.json(quakeURL, function (data) {
    earthquakeData = data;
    console.log(earthquakeData);

    // pass information and parameters for earthquake features into earthQuakes variable
    earthQuakes = L.geoJSON(earthquakeData, {
      // Define function to give each feature a popup describing the place and time of the earthquake
      onEachFeature: onEachQuake,
      // Add markers for each earthquake to layer
      pointToLayer: function (feature, latlng) {
        // console.log(latlng);
        return new L.circleMarker(latlng, {
          radius: feature.properties.mag * 4,
          // radius: 4,
          // fillColor: "red",
          fillColor: magColors(feature.properties.mag),
          color: magColors(feature.properties.mag),
          // color: "red",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.6
        });
      }
    });
    // console.log("earthQuake circleMarker is working");
    // pass data into createMap function
    createMap(earthQuakes, plates);
  })
})





//// Create Features functions for Map to pass into layer functions////

// Create function that binds creates layer and binds popup about Plate data
function onEachFault(feature, layer) {
  L.polyline(feature.geometry.coordinates, {
    color: "blue",
    weight: 2
  });
  // console.log("createTFeatures polyline is working");
  layer.bindPopup('<h1> "Plate Name:" ' + feature.properties.Name + '</h1>');
  // console.log("createTFeatures popup is working")
}
//   // End of Tectonic//


// // Create Earthquake Features

// Define function to bind popup for each earthquake
function onEachQuake(feature, layer) {
  layer.bindPopup("<h3> Place: " + feature.properties.place +
    "</h3><hr><p> Magnitude: " + feature.properties.mag +
    "<br> Date: " + new Date(feature.properties.time) + "</p>");
  // console.log("onEachQuake popup is working")
}


// // pass information and parameters for earthquake features into earthQuakes variable
// earthQuakes = L.geoJSON(earthquakeData, {
//   // Define function to give each feature a popup describing the place and time of the earthquake
//   onEachFeature: onEachQuake,
//   // Add markers for each earthquake to layer
//   pointToLayer: quakeMarkers
// });
// end of earthquake//
// return earthQuakes;
// }




// define CreateMap function to create map
function createMap(earthQuakes, plates) {
  // Define satellite, streetmap, lightmap and darkmap layers
  // Satellite layer
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    accessToken: API_KEY
  });
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  // Lightmap layer
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    accessToken: API_KEY
  });
  // Darkmap layer
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold base map layers
  var baseMaps = {
    "Satellite Map": satellite,
    "Street Map": streetmap,
    "Light Map": lightmap,
    "Dark Map": darkmap
  };
  // Define overlayMaps object to hold overlay map layers
  var overlayMaps = {
    "Fault Lines": plates,
    "Earthquakes": earthQuakes
  };

  //// BUILD BASIC MAP////
  // Create the map object
  var myMap = L.map("map", {
    center: [15.4814206, -66.4120608],
    zoom: 3,
    layers: [satellite, earthQuakes, plates]
  });

  // Add layer control to the map and pass in map layers
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  // Create a legend
  var legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += '<i style = "background:' + magColors(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}

//// Create magColors function for marker colors
function magColors(mag) {
  switch (true) {
    case (mag > 5):
      return "wine";
    case (mag > 4):
      return "red";
    case (mag > 3):
      return "gold";
    case (mag > 2):
      return "yellow";
    case (mag > 1):
      return "yellowgreen";
    default:
      return "lime";
  }
}