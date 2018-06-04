// Reference: http://jsfiddle.net/9fyrecy1/28/
// Reference: http://jsfiddle.net/highcharts/3mn2Lf0t/3/
// Polyfills: https://hackernoon.com/polyfills-everything-you-ever-wanted-to-know-or-maybe-a-bit-less-7c8de164e423
/**

  POLYFILLS NEEDED:
  - includes
  - Object.values//
  - findIndex
 */


const Highcharts = require('highcharts');
require('highcharts/modules/data')(Highcharts);
require('highcharts/modules/drilldown')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
// import '../../globals/defense360-highcharts-theme.js';
import csv from '/js/data.csv'

const valueTypes = ['current', 'constant']
const colors = ['#196c95', '#5db6d0', '#f9bc65', '#d66e42', '#4f9793', '#3e7a82', '#4b5255']

var data = {
  'current': {},
  'constant': {}
}
var datasets
var seriesData = {}
var years = []

var drilldownData = {
  'current': {},
  'constant': {}
}
var seriesDrilldown = []
var yTitle = ''
let currentType = 'current'

function populateSelect() {
  var options = '';
  datasets.forEach(function(i, dataset) {
    options += '<option value="'+ i + '">' + dataset + '</option>';
  })
  // $('.datasets').append(options);

  // Destroy & redraw chart so we get smooth animation when switching datasets.
  // $('.datasets').on('change', function() {
  //   var chart = $('#hcContainer').highcharts()
  //   chart.destroy()
  //   renderChart(seriesData[this.value], seriesDrilldown[this.value],datasets[this.value])
  // })
}

const chart = Highcharts.chart('hcContainer', {
    colors: colors,
    chart: {
      type: 'area',
      height: 600,
      events: {
        drilldown: function(e) {
          if ( !e.seriesOptions ) {
            let chart = this
            let series = drilldownData[currentType][e.point.id]
            for (let i = 0; i < series.length; i++ ) {
              series[i].color = colors[i]
              chart.addSingleSeriesAsDrilldown(e.point, series[i])
            }
            chart.applyDrilldown()
          }
        }
      }
    },
    title: {
      text: 'Procurement Funding'
    },
    subtitle: {
      text: ''
    },
    data: {
      csvURL: 'https://raw.githubusercontent.com/CSIS-iLab/defense360-viz/hc-template-variable/templates/hc-area-multiple-drilldown/js/data.csv',
      switchRowsAndColumns: true,
      parsed: function(columns) {
        columns.forEach(function(code, i) {
          if ( i == 0 ) {
            return
          }

          var level1 = code[0];
          var level2 = code[1];
          var level3 = code[2];
          var level4 = code[3];
          var year = code[4];

          const valueTypesColumns = {
            'current': code[5],
            'constant': code[6]
          }

          if ( !years.includes(year) ) {
            years.push(year)
          }
          
          valueTypes.forEach(function(type, index) {
            data[type][level1] = data[type][level1] || {
              name: level1,
              colorByPoint: false,
              data: {}
            }

            const level1Slug = slugify([year, level1])
            const level1ID = slugify([level1])

            data[type][level1].data[level1Slug] = data[type][level1].data[level1Slug] || {
              id: level1ID,
              name: 'Fiscal Year ' + year,
              drilldown: true,
              y: 0
            }

            data[type][level1].data[level1Slug].y += valueTypesColumns[type]

            // Drilldowns
            const level2Slug = slugify([level1, level2])
            const level3Slug = slugify([year, level2Slug])

            drilldownData[type][level1ID] = drilldownData[type][level1ID] || []
            let level2Index = drilldownData[type][level1ID].findIndex(d => d.id === level2Slug)
            if ( level2Index === -1 ) {
              drilldownData[type][level1ID].push({
                name: level1 + ' ' + level2,
                id: level2Slug,
                // color: colors[0],
                data: [{
                  name: 'Fiscal Year ' + year,
                  id: level3Slug,
                  drilldown: true,
                  y: valueTypesColumns[type]
                }]
              })
            } else {

              let level3Index = drilldownData[type][level1ID][level2Index].data.findIndex(d => d.id === level3Slug)

              if ( level3Index > -1 ) {
                drilldownData[type][level1ID][level2Index].data[level3Index].y += valueTypesColumns[type]
              } else {
                drilldownData[type][level1ID][level2Index].data.push({
                  name: 'Fiscal Year ' + year,
                  id: level3Slug,
                  drilldown: true,
                  y: valueTypesColumns[type]
                })
              }
            }

            //data[type][level1].data[level1Slug].y += valueTypesColumns[type]

          })
        })

        console.log(drilldownData[currentType])

        datasets = Object.keys(data)

        valueTypes.forEach(function(type, index) {
          seriesData[type] = Object.keys(data[type]).map(p => {
            data[type][p].data = Object.values(data[type][p].data)
            return data[type][p]
          })
        });

        console.log(seriesData)

        populateSelect()
      },
      complete: function(options) {
        options.series = seriesData[currentType]
        chart.xAxis[0].setCategories(years)
      }
    },
    plotOptions:
    {
      area: {
        stacking: 'normal',
        lineColor: null,
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: null,
          symbol: 'circle',
          radius: 3
        },
        cursor: 'pointer',
        trackByArea: true
      }
    },
    tooltip: {
      valueDecimals: 2,
      valuePrefix: '$',
      valueSuffix: 'M'
    },
    xAxis: {
      title: 'Fiscal Year',
      allowDecimals: false,
      categories: ['FY99', 'FY00', 'FY01', 'FY02', 'FY03', 'FY04', 'FY05', 'FY06'],
      tickmarkPlacement: 'on'
    },
    yAxis: {
      title: {
        text: "Total Obligational Authority in Constant FY19 Dollars"
      },
      labels: {
          formatter: function () {
              var label = "$" + this.value/1000 +"B";
              return label;
          }
      }
    },
});

function slugify(words) {
  var slug = ''
  words.forEach(function(word, i) {
    var prefix = '-'
    if ( i == 0 ) { prefix = '' }
    slug += prefix + word
  })
  slug = slug.replace(/\s+/g, '-').toLowerCase();
  return slug
}