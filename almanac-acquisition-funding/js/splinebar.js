const SPREADSHEET_ID = '18X_ICu7g2BxeVdPBFohbmdoApNFzJoY7DiTqCW934Ts'
var defense_system = window.top.document.title
  .replace(' | Defense360', '')
  .replace(/(_|%20)/g, ' ')
var chart
gapi.load('client', function() {
  gapi.client
    .init({
      apiKey: 'AIzaSyA1ol27C1FVv-F6940xNXY-VImb5ZCE3JE',
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      discoveryDocs: [
        'https://sheets.googleapis.com/$discovery/rest?version=v4'
      ]
    })
    .then(function() {
      gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: SPREADSHEET_ID,
          range: "'" + defense_system + "'!A:Z"
        })
        .then(function(sheet) {
          var sheetData = {
            title: sheet.result.values[0],
            subtitle: sheet.result.values[1],
            credits: sheet.result.values[2],
            yAxis1: sheet.result.values[3],
            yAxis2: sheet.result.values[4],
            rows: {
              current: [
                sheet.result.values[5],
                ...sheet.result.values
                  .slice(6)
                  .filter(function(r) {
                    return r[0].toLowerCase().indexOf('current') > -1
                  })
                  .map(function(r) {
                    return r.map(function(v) {
                      return isNaN(v) ? v : v * 1000000
                    })
                  }),
                ...sheet.result.values.filter(function(r) {
                  return r[0].toLowerCase().indexOf('quantity') > -1
                })
              ],
              constant: [
                sheet.result.values[5],
                ...sheet.result.values
                  .slice(6)
                  .filter(function(r) {
                    return r[0].toLowerCase().indexOf('constant') > -1
                  })
                  .map(function(r) {
                    return r.map(function(v) {
                      return isNaN(v) ? v : v * 1000000
                    })
                  }),
                ...sheet.result.values.filter(function(r) {
                  return r[0].toLowerCase().indexOf('quantity') > -1
                })
              ]
            }
          }

          renderChart(sheetData, 'constant')

          document
            .querySelector('select')
            .addEventListener('change', function() {
              currentType = this.value.toLowerCase()
              chart.destroy()
              renderChart(sheetData, currentType)
            })
        })
    })
})

function renderChart(sheetData, type) {
  chart = Highcharts.chart('hcContainer', {
    chart: {
      events: {
        load: function() {
          document.querySelector('.highcharts-title').innerText =
            sheetData.title
        }
      }
    },
    title: {
      text: ''
    },
    subtitle: {
      text: sheetData.subtitle
    },
    data: {
      switchRowsAndColumns: true,
      csv: sheetData.rows[type]
        .map(function(r) {
          return r.join(',')
        })
        .join('\n'),
      complete: complete
    },

    credits: {
      href: false,
      text: sheetData.credits
    },
    xAxis: {
      title: {
        text: 'Year'
      },
      labels: {
        rotation: -90,
        formatter: function() {
          var yearStr = this.value.toString()
          var twoDigitsYear = yearStr.slice(2)
          return 'FY' + twoDigitsYear
        }
      },
      tickInterval: 1,
      allowDecimals: false
    },

    yAxis: [
      {
        allowDecimals: false,
        title: {
          text: sheetData.yAxis1,
          margin: 10,
          x: -15,
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        labels: {
          style: {
            color: Highcharts.getOptions().colors[1]
          },
          x: -3,
          formatter: function() {
            return this.value ? getReduceSigFigs(this.value) : this.value
          }
        },
        reversedStacks: false
      },
      {
        allowDecimals: false,
        title: {
          text: sheetData.yAxis2,
          margin: 10,
          x: 15,
          rotation: -90,
          style: {
            color: 'black'
          }
        },
        labels: {
          style: {
            color: 'black'
          },
          x: -3
        },
        opposite: true
      }
    ],

    tooltip: {
      headerFormat:
        '<span style="font-size: 13px;text-align:center;margin-bottom: 5px;font-weight: bold;font-family: \'Roboto\', arial, sans-serif;">FY{point.key}</span><br/>',

      useHTML: true,
      shared: false,
      pointFormatter: pointFormatter
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        textOverflow: null
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      },
      spline: {
        marker: {
          enabled: false,
          symbol: 'circle'
        }
      }
    }
  })
}

function pointFormatter() {
  var toolTipData = this.series.userOptions.tooltipData
    ? this.series.userOptions.tooltipData[this.index]
    : null

  return (
    '<strong>' + this.series.name + ':</strong> ' + getReduceSigFigs(this.y)
  )
}

function complete(d) {
  var newSeries = d.series
    .filter(function(s) {
      return !specialSeries(s)
    })
    .reduce(function(total, obj) {
      var name = obj.name.split(' ')[0]

      var series = total.find(function(s) {
        return s.name === name
      })

      if (!series) {
        total.push({
          name: name ? name : 'Quantity',
          data: obj.data.map(function(d) {
            return [d[0], d[1] ? 0 : undefined]
          }),
          tooltipData: obj.data.map(function(d) {
            return [d[0], []]
          })
        })
        series = total.find(function(s) {
          return s.name === name
        })
      }

      series.data = series.data.map(function(d, i) {
        return [d[0], (d[1] += obj.data[i][1])]
      })

      return total
    }, [])

  var quantitySeries = d.series.filter(function(s) {
    return specialSeries(s)
  })

  newSeries = [...newSeries, ...quantitySeries]
  newSeries.forEach(function(s, i) {
    s.type = specialSeries(s) ? 'spline' : 'column'
    s.yAxis = specialSeries(s) ? 1 : 0
    s.color = specialSeries(s)
      ? 'black'
      : Highcharts.getOptions().colors.slice(1)[i]
    s.zoneAxis = 'x'
    s.zones = specialSeries(s)
      ? [
          {
            value: 2020,
            dashStyle: 'Solid'
          },
          {
            value: 2021,
            dashStyle: 'LongDash'
          },
          {
            value: 3000,
            dashStyle: 'LongDash'
          }
        ]
      : null
  })

  d.series = newSeries
}

function specialSeries(s) {
  return s.name.toLowerCase().indexOf('quantity') > -1
}

function getReduceSigFigs(value) {
  switch (true) {
    case value >= 1000000000:
      return '$' + Math.round((value / 1000000000) * 10) / 10 + 'B'
    case value >= 1000000 && value < 1000000000:
      return '$' + Math.round((value / 1000000) * 10) / 10 + 'M'

    case value >= 100000 && value < 1000000:
      return '$' + Math.round((value / 1000000000) * 10) / 10 + 'K'

    default:
      return value
  }
}
