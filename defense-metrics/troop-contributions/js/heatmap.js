let operations = []
let countries = []
let num_countries = 0
var seriesData = []

Highcharts.data({
  googleAPIKey: "AIzaSyBgDqxsDf6bkqy1_GV4rM6ejMCGcqzwzHU",
    googleSpreadsheetKey: '1MiSw1PR0niNG8hHS69lUHco9y1PZ_kvCFd43641ywRA',
  googleSpreadsheetRange: "Sheet1",
  parsed: function(columns) {
    console.log(columns)
    columns.forEach(function(column, index) {
      if ( index == 0 ) {
        column.shift()
        countries = column
        num_countries = countries.length
        return
      }

      if ( column[0].indexOf('-percentage') === -1 ) {
        return
      }

      let operation = column[0].replace('-percentage', '')
      operations.push(operation)
      column.shift()

      const sortedColumn = column.slice().sort()

      let q1 = quantileSorted(sortedColumn, 0.25)
      let q2 = quantileSorted(sortedColumn, 0.5)
      let q3 = quantileSorted(sortedColumn, 0.75)
      let q4 = quantileSorted(sortedColumn, 1)

      for(let i = 0; i <= num_countries - 1; i++) {
        let operationIndex = operations.indexOf(operation)
        let color = undefined

        let value = column[i]
        if ( value <= q1 ) {
          value = 1
        } else if ( value <= q2 ) {
          value = 2
        } else if ( value <= q3 ) {
          value = 3
        } else if ( value > q3 ) {
          value = 4
        }

        // 0 values are contectually different than other 0s, so visualize them differently.
        if ( operation === 'NATO Enhanced Forward Presence (2017-2018)' && column[i] == 0 ) {
          value = -1
        }

        // Assuming the columns are in percentage - raw order, get the troop values from the next column.
        let troops = columns[index + 1][i + 1]

        seriesData.push({
          x: operationIndex,
          y: i,
          value: value,
          name: operation + ': ' + countries[i],
          realValue: roundTo(column[i],2),
          troops: troops
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
      height: 1020,
      spacingBottom: 46
    },
    title: {
      text: "Troop Contributions"
    },
    credits: {
      enabled: true,
      href: false,
      position: {
        y: -15
      },
      text: "* NATO Partner<br />CSIS Defense360 | Source: See below for more detailed information"
    },
    legend: {
      title: {
        text: "Quartiles"
      },
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
          from: 3,
          to: 4,
          name: 'First',
          color: Highcharts.getOptions().colors[0]
        },
        {
          from: 2,
          to: 3,
          name: 'Second',
          color: Highcharts.getOptions().colors[1]
        },
        {
          from: 1,
          to: 2,
          name: 'Third',
          color: Highcharts.getOptions().colors[2]
        },
        {
          from: 0,
          to: 1,
          name: 'Fourth',
          color: Highcharts.getOptions().colors[3]
        },
        {
          from: -1,
          to: 0,
          color: '#9B9B9B',
          name: 'Other'
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
      categories: countries
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
        return '<span style="font-weight:bold">' + this.key + '</span><br/>Troop Contribution: ' + this.point.realValue + '%<br />Average Annual Troop Contribution: ' + this.point.troops.toLocaleString()
      }
    }
  });
}

// Taken from: https://github.com/simple-statistics/simple-statistics
function quantileSorted(e,t){var n=e.length*t;if(0===e.length)throw new Error("quantile requires at least one data point.");if(t<0||t>1)throw new Error("quantiles must be between 0 and 1");return 1===t?e[e.length-1]:0===t?e[0]:n%1!=0?e[Math.ceil(n)-1]:e.length%2==0?(e[n-1]+e[n])/2:e[n]}

// Taken from: https://stackoverflow.com/a/15762794
function roundTo(o,t){var r=!1;void 0===t&&(t=0),o<0&&(r=!0,o*=-1);var a=Math.pow(10,t);return o=parseFloat((o*a).toFixed(11)),o=(Math.round(o)/a).toFixed(2),r&&(o=(-1*o).toFixed(2)),o}