const map = L.map('map').setView([50, 15], 4);

// Adding Voyager Basemap
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Adding Voyager Labels
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png', {
  maxZoom: 18,
  zIndex: 10
}).addTo(map);

var client = new carto.Client({
  apiKey: 'hfB5I34E3XqrNbKstvX6fA',
  username: 'csis'
});

const europeanCountriesDataset = new carto.source.Dataset(`
  ne_adm0_europe_1
`);
const europeanCountriesStyle = new carto.style.CartoCSS(`
  #layer {
  polygon-fill: #162945;
    polygon-opacity: 0.5;
    ::outline {
      line-width: 1;
      line-color: #FFFFFF;
      line-opacity: 0.5;
    }
  }
`);
const europeanCountries = new carto.layer.Layer(europeanCountriesDataset, europeanCountriesStyle);



client.addLayers([europeanCountries]);
client.getLeafletLayer().addTo(map);
