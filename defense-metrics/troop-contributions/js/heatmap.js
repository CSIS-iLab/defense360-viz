let operations = []
let num_operations = 0
let countries = []
let num_countries = 0
var seriesData = []


// Highcharts.data({
//   googleSpreadsheetKey: '1MiSw1PR0niNG8hHS69lUHco9y1PZ_kvCFd43641ywRA',
//   googleSpreadsheetWorksheet: 1,
//   switchRowsAndColumns: true,
//   parsed: function(columns) {
//     columns.forEach(function(row, i) {
//       if ( i == 0 ) {
//         row.shift()
//         operations = row
//         num_operations = operations.length
//         return
//       }

//       countries.push(row[0])

//       for(let i = 0; i <= operations.length - 1; i++) {
//         let countryIndex = countries.indexOf(row[0])
//         seriesData.push({
//           x: i,
//           y: countryIndex,
//           value: row[i + 1],
//           name: row[0]
//         })
//       }
//     })
//     renderChart(operations, countries, seriesData);
//   }
// })

  Highcharts.data({
    googleSpreadsheetKey: '1MiSw1PR0niNG8hHS69lUHco9y1PZ_kvCFd43641ywRA',
      googleSpreadsheetWorksheet: 1,
      parsed: function(columns) {
        columns.forEach(function(column, i) {
          if ( i == 0 ) {
            column.shift()
            countries = column
            num_countries = countries.length
            return
          }

          let operation = column[0]
          operations.push(operation)
          column.shift()

          const sortedColumn = column.slice().sort()
          if (i == columns.length - 1) {
            console.log(column)
            console.log(sortedColumn);
            console.log(quantileRankSorted(sortedColumn, 0))
          }

          for(let i = 0; i <= countries.length - 1; i++) {
            let operationIndex = operations.indexOf(operation)
            seriesData.push({
              x: operationIndex,
              y: i,
              value: quantileRankSorted(sortedColumn, column[i]),
              name: operation + ': ' + countries[i],
              realValue: roundTo(column[i],2)
            })
          }
        })
        renderChart(operations, countries, seriesData);
      }
  })


function renderChart(operations, countries, data) {
  Highcharts.chart('hcContainer', {
    chart: {
      type: 'heatmap',
      height: 1000
    },
    title: {
      text: "Troop Contributions"
    },
    credits: {
      enabled: true,
      href: false,
      text: "CSIS Defense360 | Source: NAME"
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'middle',
      y: 25,
      symbolHeight: 15
    },
    colorAxis: {
      reversed: true,
      dataClasses: [
        {
          from: 0.75,
          to: 1,
          name: 'First',
          color: Highcharts.getOptions().colors[0]
        },
        {
          from: 0.5,
          to: 0.75,
          name: 'Second',
          color: Highcharts.getOptions().colors[1]
        },
        {
          from: 0.25,
          to: 0.5,
          name: 'Third',
          color: Highcharts.getOptions().colors[2]
        },
        {
          from: 0,
          to: 0.25,
          name: 'Fourth',
          color: Highcharts.getOptions().colors[3]
        }
      ],
      min: 0
    },
    xAxis: {
      opposite: true,
      categories: operations
    },
    yAxis: {
      title: null,
      reversed: true,
      categories: ["Albania", "Austria*", "Belgium", "Bulgaria", "Canada", "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland*", "France", "Georgia*", "Germany", "Greece", "Hungary", "Iceland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Moldova*", "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania", "Slovak Republic", "Slovenia", "Spain", "Sweden*", "Turkey", "Ukraine*", "United Kingdom", "United States"]
    },
    series: [{
      borderWidth: 1,
      borderColor: '#fff',
      data: data,
      dataLabels: {
        enabled: true,
        padding: 10,
        formatter: function() {
          return this.point.realValue + '%'
        }
      }
    }],
    plotOptions: {
      heatmap: {
        borderColor: '#fff'
      }
    },
    tooltip: {
      formatter: function() {
        return '<span style="font-weight:bold">' + this.key + '</span><br/>Troop Contribution: ' + this.point.realValue + '%'
      }
    }
  });
}

// Taken from: https://github.com/simple-statistics/simple-statistics
function quantileRankSorted(r,n){if(n<r[0])return 0;if(n>r[r.length-1])return 1;var e=lowerBound(r,n);if(r[e]!==n)return e/r.length;e++;var t=upperBound(r,n);if(t===e)return e/r.length;var u=t-e+1;return u*(t+e)/2/u/r.length}function lowerBound(r,n){for(var e=0,t=0,u=r.length;t<u;)n<=r[e=t+u>>>1]?u=e:t=-~e;return t}function upperBound(r,n){for(var e=0,t=0,u=r.length;t<u;)n>=r[e=t+u>>>1]?t=-~e:u=e;return t}

// Taken from: https://stackoverflow.com/a/15762794
function roundTo(o,t){var r=!1;void 0===t&&(t=0),o<0&&(r=!0,o*=-1);var a=Math.pow(10,t);return o=parseFloat((o*a).toFixed(11)),o=(Math.round(o)/a).toFixed(2),r&&(o=(-1*o).toFixed(2)),o}