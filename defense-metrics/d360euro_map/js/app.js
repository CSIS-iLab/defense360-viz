const map = L.map('map').setView([50, 15], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/ilabmedia/cjj5wwc2o0x3o2so08xb67sgz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw', {
  maxZoom: 18
}).addTo(map);

// Labels only: https://api.mapbox.com/styles/v1/ilabmedia/cjj6498ou13z82spse1nx57jv/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw
// Vorager labels only: https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png
// L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png', {
//   maxZoom: 18,
//   zIndex: 50
// }).addTo(map);

map.attributionControl.addAttribution('<a href="https://defense360.csis.org">CSIS Defense360</a>')

var client = new carto.Client({
  apiKey: 'JCI4eCWS8g15JuLLV3iYVg',
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

const basesData = new carto.source.Dataset('nato_map_bases');
const basesStyles = new carto.style.CartoCSS(`
  #layer {
    marker-width: 10;
    marker-fill: #D05F4C;
    marker-line-color: #FFFFFF;

    [type = "NATO Bases"] {
      marker-fill: #75657A;
    }
  }
`);

const basesLayer = new carto.layer.Layer(basesData, basesStyles, {
  featureOverColumns: ['name', 'type']
});

client.addLayers([natoCountriesLayer,basesLayer]);
client.getLeafletLayer().addTo(map);

const popup = L.popup({ closeButton: false });
natoCountriesLayer.on(carto.layer.events.FEATURE_OVER, featureEvent => {
  let data = featureEvent.data
  popup.setLatLng(featureEvent.latLng);
  popup.setContent(`
    <span class="country-name">${data.country_name}</span>
    <span class="label">2017 % GDP on Defense:</span> 
    ${validatePopupValue(data.gdp_percentage, '', '%')}<br />
    <span class="label">2017 GDP (2010 US$):</span> 
    ${validatePopupValue(data.gdp_raw, '$', 'B')}<br />
    <span class="label">Defense Budget (2010 US$):</span> 
    ${validatePopupValue(data.defense_budget, '$', 'B')}<br />
    <span class="label">2017 Equipment %:</span> 
    ${validatePopupValue(data.equipment_percentage, '', '%')}<br />
    <span class="label">2017 Total Active Duty Force:</span> 
    ${validatePopupValue(data.total_active_duty_force.toLocaleString())}<br />
    <span class="label">2018 Active Duty U.S. Troops in Country:</span> 
    ${validatePopupValue(data.active_us_troops.toLocaleString())}<br />
    <span class="label">Overall Mobility:</span> 
    ${validatePopupValue(data.mobility_score)} <span class="label">/ 24</span><br />
    <span class="label">Ground Mobility:</span> 
    ${validatePopupValue(data.ground_mobility)} <span class="label">/ 3</span><br />
    <span class="label">Air Mobility:</span> 
    ${validatePopupValue(data.air_mobility)} <span class="label">/ 4</span><br />
  `);
  if (!popup.isOpen()) {
    popup.openOn(map);
  }
});

natoCountriesLayer.on(carto.layer.events.FEATURE_OUT, featureEvent => {
  popup.removeFrom(map);
});

const popupBases = L.popup({ closeButton: false });
basesLayer.on(carto.layer.events.FEATURE_OVER, featureEvent => {
  let data = featureEvent.data
  popupBases.setLatLng(featureEvent.latLng);
  popupBases.setContent(data.name);
  if (!popupBases.isOpen()) {
    popupBases.openOn(map);
  }
});

basesLayer.on(carto.layer.events.FEATURE_OUT, featureEvent => {
  popupBases.removeFrom(map);
});

function validatePopupValue(value, prefix = '', suffix = '') {
  if ( !value ) {
    return '-'
  }
  return prefix+value+suffix
}

/*----------  Shading  ----------*/
const layerStyles = {
  overall: {
    field: 'mobility_score',
    max: 24
  },
  ground: {
    field: 'ground_mobility',
    max: 3
  },
  air: {
    field: 'air_mobility',
    max: 4
  }
}
let currentLayer = layerStyles.overall

const mobilitySelector = document.querySelector('.js-mobility')
mobilitySelector.addEventListener("change", function() {
  currentLayer = layerStyles[this.value]
  updateLayerStyles(currentLayer.field)
  updateLegend(currentLayer.max)
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

function updateLayerStyles(layer) {
  natoCountriesStyles.setContent(`#layer {
    polygon-fill: ramp([${layer}], (${colors}), quantiles);
    ::outline {
      line-color: #dfe5e7;
      line-width: 1;
    }
    ::labels {
      text-name: [country_name];
      text-face-name: 'Open Sans Regular';
      text-size: 11;
      text-fill: #FFFFFF;
      text-label-position-tolerance: 0;
      text-halo-radius: 1;
      text-halo-fill: #6F808D;
      text-dy: -10;
      text-allow-overlap: true;
      text-placement: point;
      text-placement-type: dummy;
      text-transform: uppercase;
    }
    ${partnerCountries}
  }`);
}

function updateLegend(max) {
  document.getElementById('legend-max').innerHTML = max;
}

updateLayerStyles(currentLayer.field)
updateLegend(currentLayer.max)

