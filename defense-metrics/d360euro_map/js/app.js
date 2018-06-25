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
  apiKey: 'RoNKupXWKtMngcY5aciIdQ',
  username: 'csis'
});

const europeanCountriesDataset0 = new carto.source.Dataset(`
  ne_adm0_europe_2
`);
const europeanCountriesStyle0 = new carto.style.CartoCSS(`
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
const europeanCountries0 = new carto.layer.Layer(europeanCountriesDataset0, europeanCountriesStyle0);

const europeanCountriesDataset1 = new carto.source.SQL(`
  SELECT *
    FROM ne_adm0_europe_2
    WHERE admin IN (SELECT field_1 FROM ground_mobility_rating_sheet1_1 WHERE spod=1)
`);
const europeanCountriesStyle1 = new carto.style.CartoCSS(`
  #layer {
  polygon-fill: #647A32;
    polygon-opacity: 0.5;
    ::outline {
      line-width: 1;
      line-color: #FFFFFF;
      line-opacity: 0.5;
    }
  }
`);
const europeanCountries1 = new carto.layer.Layer(europeanCountriesDataset1, europeanCountriesStyle1);


client.addLayers([europeanCountries1]);
client.getLeafletLayer().addTo(map);
