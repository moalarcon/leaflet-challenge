//// BUILD BASIC MAP

// Create the map object
var myMap = L.map("map", {
  center: [36.214577, -113.6967495],
  zoom: 3
});

// Create the tile layers that will be the basemaps of our map

// Define a baseMaps object to hold base layers
let baseMaps = {
  "Outdoors": outdoors,
  "Satellite": satellite,
  "Dark Map": darkmap,
};

// later add other basemaps layers and add lightmap variable as one layer
// let lightmap = 
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Function to create map
function createMap(earthquakes, faultLines, timelineLayer) {
  // Define outdoors, satellite, lightmap and darkmap layers
  // Outdoors layer
  let outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token={accessToken}" +
    "A3IKm_S6COZzvBMTqLvukQ");
  // Satellite layer
  let satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token={accessToken}" +
    "A3IKm_S6COZzvBMTqLvukQ");
  // Lightmap layer
  let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  })
  // Darkmap layer
  let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token={accessToken}" +
    "A3IKm_S6COZzvBMTqLvukQ");



  //// GET DATA FOR MAP

  // Store API query variables
  var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  var tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

  let earthquakeData;
  let tectonicData;

  //// Render Map
  renderMap(quakeURL, tectonicURL);

  function renderMap(quakeURL, tectonicURL) {
    // GET request for earthquake URL using d3
    d3.json(quakeURL, function (data) {
      console.log(quakeURL)
      console.log(data)
      quakeData = data;
      // GET request for tectonic URL using d3
      d3.json(tectonicURL, function (data) {
        console.log(tectonicURL)
        console.log(data)
        tectonicData = data;

        // pass data into mapFeatures function
        mapFeatures(quakeData, tectonicData);
      });
    });
  }

  //// CREATE FUNCTION TO ADD FEATURES
  function mapFeatures(quakeData, tectonicData) {

    // Loop through features and add markers for each earthquake in quakeData; bind pop-up with info
    function earthquakeMarkers(feature, layer) {
      quakeData.forEach(earthquake =>
        L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
          fillOpacity: 0.8,
          color: markerColor(earthquake.properties.mag),
          fillColor: markerColor(earthquake.properties.mag),
          radius: markerSize(earthquake.properties.mag)
        }).bindPopup("<h2>" + earthquake.properties.place +
          "</h2> <hr> <h3>Date: " + new Date(earthquake.properties.time) + " </h3> <hr> <h3>Magnitude: " + earthquake.properties.mag +
          "</h3>").addTo(myMap));
    }
  }




  // // use forEach to iterate through features  and pull out variables
  // features.forEach(earthquake => {
  //   var properties = earthquake.properties;
  //   console.log(properties);
  //   // var mag = properties.mag;
  //   // console.log(mag)
  //   //   // var location = properties.place;
  //   //   // var eventLink = properties.url;
  //   //   // var when = properties.time;
  //   //   // var coordinates = geometry.coordinates;
  //   // }
  // });


  //// CREATE FUNCTION FOR FEATURES

  //   function mapFeatures(quakeData, tectonicData)
  //   //Loop through the features key in the response and create one market for each earthquake in the array
  //   quakeData.forEach(earthquake =>
  //     L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
  //       fillOpacity: 0.75,
  //       color: "red",
  //       radius: markerSize(magnitude)
  //     }).bindPopup("<h1>" + earthquake.properties.place +
  //       "</h1> <hr> <h3> Magnitude: " + earthquake.properties.mag +
  //       "</h3>").addTo(myMap));

  // });



  // // Create a new marker cluster group
  // var markers = L.markerClusterGroup();

  // // Loop through data
  // for (var i = 0; i < features.length; i++) {
  //   // Set the data location property to a variable
  //   var location = features[i].properties.place;
  //   var magnitude = features[i].properties.mag;
  //   var event_link = features[i].properties.url;
  //   var when = features[i].properties.time;
  //   var coordinates = features[i].geometry.coordinates;

  // // Check for location property
  // if (location) {

  //   // Add a new marker to the cluster group and bind a pop-up
  //   markers.addLayer(L.marker([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]]).bindPopup(features[i].properties.place));
  // }

  // }

  // // Add our marker cluster layer to the map
  // myMap.addLayer(markers);

  // });

  //// MARKER DESIGN FUNCTIONS

  // // Define a markerSize function that will give each city a different radius based on its population
  // function markerSize(magnitude) {
  //   return magnitude * 7;
  // }

  // // Define a markerColor function that will give each city a different color based on its magnitude
  // function markerColor(magnitude) {
  //   if (magnitude > 5) {
  //     color: "red";
  //   }
  //   else if (magnitude > 4) {
  //     color: "orange";
  //   }
  //   else if (magnitude > 3) {
  //     color: "yellow";
  //   }
  //   else if (magnitude > 2) {
  //     color: "yellowgreen";
  //   }
  //   else if (magnitude > 1) {
  //     color: "greenyellow";
  //   }
  //   else {
  //     color: "green";
  //   }