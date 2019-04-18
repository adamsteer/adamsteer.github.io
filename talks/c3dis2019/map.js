// Create map layers
var layers = {
  'basemap': L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL'
  }),

};

// Get url parameters
var params = {};
window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
  params[key] = value;
});

if (params.layers) {
  var activeLayers = params.layers.split(',').map(function(item) { // map function not supported in IE < 9
    return layers[item];
  });
}

// Create map
var map = new L.Map('map', {
  center: [params.lat || -41.2728, params.lng || 173.2996],
  minZoom: 4,
  maxZoom: 12,
  zoom: params.zoom || 6,
  layers: activeLayers || [layers.basemap]
});


// Add controls
L.control.scale().addTo(map);
L.control.layers({}, layers).addTo(map);
