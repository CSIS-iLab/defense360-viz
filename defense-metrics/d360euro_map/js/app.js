const map = L.map('map').setView([50, 15], 4);

// https://api.mapbox.com/styles/v1/ilabmedia/cjj4grwom04892sp39x48dlvn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw
// Voyager
L.tileLayer('https://api.mapbox.com/styles/v1/ilabmedia/cjj5wwc2o0x3o2so08xb67sgz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw', {
  maxZoom: 18
}).addTo(map);

// Labels only: https://api.mapbox.com/styles/v1/ilabmedia/cjj4psbcp4hzb2sqb7iuo2njc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw
// Vorager labels only: https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png
// L.tileLayer('https://api.mapbox.com/styles/v1/ilabmedia/cjj4psbcp4hzb2sqb7iuo2njc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw', {
//   maxZoom: 18,
//   zIndex: 50
// }).addTo(map);

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

const featureColumns = ['country_name', 'gdp_percentage', 'gdp_raw', 'defense_budget', 'equipment_percentage', 'total_active_duty_force', 'active_us_troops', 'mobility_score', 'ground_mobility', 'air_mobility']

const natoCountriesLayer = new carto.layer.Layer(natoCountriesData, natoCountriesStyles, {
  featureOverColumns: featureColumns
});

// % spent of GDP on defense, their defense budget, the % of defense budget spent on equipment, and the size of their active duty force

client.addLayer(natoCountriesLayer);
client.getLeafletLayer().addTo(map);

const popup = L.popup({ closeButton: false });
natoCountriesLayer.on(carto.layer.events.FEATURE_OVER, featureEvent => {
  let data = featureEvent.data
  popup.setLatLng(featureEvent.latLng);
  popup.setContent(`
    <span class="country-name">${data.country_name}</span>
    <span class="label">2017 % GDP on Defense:</span> 
    ${data.gdp_percentage}%<br />
    <span class="label">2017 GDP (2010 US$):</span> 
    $${data.gdp_raw}B<br />
    <span class="label">Defense Budget (2010 US$):</span> 
    $${data.defense_budget}B<br />
    <span class="label">2017 Equipment %:</span> 
    ${data.equipment_percentage}%<br />
    <span class="label">2017 Total Active Duty Force:</span> 
    ${data.total_active_duty_force.toLocaleString()}<br />
    <span class="label">2018 Active Duty U.S. Troops in Country:</span> 
    ${data.active_us_troops.toLocaleString()}<br />
    <span class="label">Overall Mobility:</span> 
    ${data.mobility_score} <span class="label">/ 24</span><br />
    <span class="label">Ground Mobility:</span> 
    ${data.ground_mobility} <span class="label">/ 3</span><br />
    <span class="label">Air Mobility:</span> 
    ${data.air_mobility} <span class="label">/ 4</span><br />
  `);
  if (!popup.isOpen()) {
    popup.openOn(map);
  }
});

// natoCountriesLayer.on(carto.layer.events.FEATURE_OUT, featureEvent => {
//   popup.removeFrom(map);
// });

/*----------  Shading  ----------*/
const mobilitySelector = document.querySelector('.js-mobility')
mobilitySelector.addEventListener("change", function() {
  let layer = layerStyles[this.value]
  updateLayerStyles(layer)
})

const colors = '#fbe4a3, #d0d197, #96b586, #4ba292,#008e9d';
const partnerCountries = `
  [is_partner = 1] {
    polygon-pattern-file: url(https://i.imgur.com/k3J0pnR.png);
    polygon-pattern-opacity: 0.4;
    polygon-pattern-alignment: global;
     line-color: #dfe5e7;
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
      line-color: #dfe5e7;
      line-width: 1;
    }
    ${partnerCountries}
  }`);
}

updateLayerStyles(layerStyles.overall)

