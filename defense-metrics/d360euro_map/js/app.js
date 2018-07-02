const map = L.map('map').setView([50, 15], 4);

// https://api.mapbox.com/styles/v1/ilabmedia/cjj4grwom04892sp39x48dlvn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw
// Voyager
L.tileLayer('https://api.mapbox.com/styles/v1/ilabmedia/cjj4grwom04892sp39x48dlvn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw', {
  maxZoom: 18
}).addTo(map);

// Labels only: https://api.mapbox.com/styles/v1/ilabmedia/cjj4psbcp4hzb2sqb7iuo2njc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw
// Vorager labels only: https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png
L.tileLayer('https://api.mapbox.com/styles/v1/ilabmedia/cjj4psbcp4hzb2sqb7iuo2njc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw', {
  maxZoom: 18,
  zIndex: 100
}).addTo(map);

var client = new carto.Client({
  apiKey: 'wb6BQbxW-Z_a3tVYS26J7Q',
  username: 'csis'
});

const natoCountriesData = new carto.source.Dataset('defense_metrics_nato_map');
const natoCountriesStyles = new carto.style.CartoCSS(`
  #layer {
    polygon-opacity: 0.5;
  }
`);
const natoCountriesLayer = new carto.layer.Layer(natoCountriesData, natoCountriesStyles);

client.addLayers([natoCountriesLayer]);
client.getLeafletLayer().addTo(map);

const popup = L.popup({ closeButton: false });
natoCountriesLayer.on(carto.layer.events.FEATURE_OVER, featureEvent => {
  console.log(featureEvent)
  popup.setContent(``);
  if (!popup.isOpen()) {
    popup.openOn(map);
  }
});

natoCountriesLayer.on(carto.layer.events.FEATURE_OUT, featureEvent => {
  popup.removeFrom(map);
});

/*----------  Shading  ----------*/
const mobilitySelector = document.querySelector('.js-mobility')
mobilitySelector.addEventListener("change", function() {
  let layer = layerStyles[this.value]
  updateLayerStyles(layer)
})

// const colors = '#e6e56b,#B9DE73,#84C076,#5BA075,#41806C,#365F5A';
const colors = '#cee0de, #a8c0bd, #82a09c, #5c7f7b, #365F5A';
// const colors = '#96b586, #7ea07b, #668a70, #4e7465, #4e7465';
const partnerCountries = `
  [is_partner = 1] {
    polygon-pattern-file: url(http://com.cartodb.users-assets.production.s3.amazonaws.com/patterns/diagonal_1px_med.png);
    polygon-pattern-opacity: 0.2;
    polygon-pattern-alignment: global;
     line-color: #FFFFFF;
     line-width: 0.5;
     line-opacity: 1;
     line-dasharray: 10, 5;
  }
`;
const layerStyles = {
  overall: 'mobility_score',
  ground: 'ground_mobility',
  air: 'air_mobility'
}

function updateLayerStyles(layer) {
  natoCountriesStyles.setContent(`#layer {
    polygon-fill: ramp([${layer}], (${colors}), quantiles);
    ::outline {
      line-color: #fff;
      line-width: 0.75;
    }
    ${partnerCountries}
  }`);
}

updateLayerStyles(layerStyles.overall)

