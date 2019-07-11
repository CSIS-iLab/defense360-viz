window.addEventListener('message', function(event) {
  if (event.origin.indexOf('google') > -1) return
  console.log(event.data)
  var defense_system = event.data
    .replace(' | Defense360', '')
    .replace(/(_|%20)/g, ' ')

  callChart(defense_system)
})

function callChart(defense_system) {
  const SPREADSHEET_ID = '18X_ICu7g2BxeVdPBFohbmdoApNFzJoY7DiTqCW934Ts'

  var chart
  gapi.load('client', function() {
    gapi.client
      .init({
        apiKey: 'AIzaSyBukM0ddC8qPCIJvhE3ZXyDMnXRELLTb8k',
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
                  ...sheet.result.values.slice(6).filter(function(r) {
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
                  ...sheet.result.values.slice(6).filter(function(r) {
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

            var bodyHeight =
              document.querySelector('.highcharts-root').clientHeight + 150

            window.parent.postMessage(bodyHeight, '*')
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
        headerFormat: '',
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
    var table = '<table>'

    table += '<thead>'
    table += '<tr>'
    table += '<th colspan="2">FY' + this.x + '</th>'
    table += '</tr>'
    table += '</thead>'
    table += '<tbody>'
    table += '<tr>'
    table +=
      '<td style="background-color:rgba(' +
      hexToRgb(this.series.color) +
      ',.25)">' +
      this.series.name +
      '</td>'
    table +=
      '<td style="background-color:rgba(' +
      hexToRgb(this.series.color) +
      ',.125)">' +
      getReduceSigFigs(this.y) +
      '</td>'
    table += '</tr>'
    table += '</tbody>'
    table += '</table>'

    return table
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
            name: name,
            data: obj.data.map(function(d) {
              return [d[0], d[1] ? 0 : undefined]
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
        ? '#000000'
        : Highcharts.getOptions().colors.slice(1)[i]
      s.zoneAxis = 'x'

      var procured = s.name.toLowerCase().indexOf('procured') > -1
      var planned = s.name.toLowerCase().indexOf('planned') > -1
      s.dashStyle = planned ? 'ShortDash' : 'Solid'
    })

    d.series = newSeries
  }

  function specialSeries(s) {
    return s.name.toLowerCase().indexOf('quantity') > -1
  }

  function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    result = result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null
    return result ? result.r + ',' + result.g + ',' + result.b : null
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
}
