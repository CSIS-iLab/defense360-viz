const SPREADSHEET_ID = '123BpzTEYtesF2LI0VA_0ial9mQx4dlek9hoM3GRjwas'
let defense_system = window.location.search
  .replace('?id=', '')
  .replace(/(_|%20)/g, ' ')
let chart
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
          range: `'${defense_system}'!A:Z`
        })
        .then(function(sheet) {
          let sheetData = {
            title: sheet.result.values[0],
            subtitle: sheet.result.values[1],
            credits: sheet.result.values[2],
            yAxis: sheet.result.values[3],
            rows: {
              current: [
                sheet.result.values[4],
                ...sheet.result.values
                  .slice(5)
                  .filter(r => r[0].toLowerCase().indexOf('current') > -1)
              ],
              constant: [
                sheet.result.values[4],
                ...sheet.result.values
                  .slice(5)
                  .filter(r => r[0].toLowerCase().indexOf('constant') > -1)
              ]
            }
          }

          console.log(sheetData)
          renderChart(sheetData, 'current')

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
    chart: { type: 'spline' },
    title: {
      text: sheetData.title
    },
    subtitle: {
      text: sheetData.subtitle
    },
    data: {
      switchRowsAndColumns: true,
      csv: sheetData.rows[type].map(r => r.join(',')).join('\n'),
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
    yAxis: {
      allowDecimals: false,
      title: {
        text: sheetData.yAxis,
        margin: 10,
        x: -15
      }
    },
    tooltip: {
      headerFormat:
        '<span style="font-size: 13px;text-align:center;margin-bottom: 5px;font-weight: bold;font-family: \'Roboto\', arial, sans-serif;">{point.key}</span><br/>',

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
  let toolTipData = this.series.userOptions.tooltipData
    ? this.series.userOptions.tooltipData[this.index]
    : null

  return (
    '<strong>' +
    this.series.name +
    '</strong><br/>' +
    (toolTipData
      ? 'A: ' +
        getReduceSigFigs(toolTipData[1][0]) +
        '<br/>B: ' +
        getReduceSigFigs(toolTipData[1][1]) +
        '<br/><br/>'
      : getReduceSigFigs(this.y))
  )
}

function complete(d) {
  let newSeries = d.series
    .filter(s => s.name.toLowerCase().indexOf('actual') < 0)
    .reduce(function(total, obj) {
      let name = obj.name.split(' ')[1]

      let series = total.find(s => s.name === name)

      if (!series) {
        total.push({
          name: name ? name : 'Actual',
          data: obj.data.map(d => [d[0], d[1] ? 0 : undefined]),
          tooltipData: obj.data.map(d => [d[0], []])
        })
        series = total.find(s => s.name === name)
      }

      series.data = series.data.map((d, i) => {
        if (series.tooltipData[i][1]) {
          series.tooltipData[i][1].push(obj.data[i][1])
        } else {
          series.tooltipData[i][1] = []
        }

        return [d[0], (d[1] += obj.data[i][1])]
      })

      return total
    }, [])
  let actualSeries = d.series.find(
    s => s.name.toLowerCase().indexOf('actual') > -1
  )

  newSeries.push({ ...actualSeries })
  newSeries.forEach((s, i) => {
    s.name = i === 8 ? s.name : 'PB ' + s.name
    s.color = i === 8 ? 'black' : Highcharts.getOptions().colors[i]
    s.dashStyle = i === 8 ? 'Solid' : 'LongDash'
  })

  d.series = newSeries
}
function getReduceSigFigs(v, s = 'M') {
  value = v * 1000
  if (value >= 1000000000) {
    return Math.round((value / 1000000000) * 10) / 10
  } else if (value >= 1000000 && value < 1000000000) {
    switch (s) {
      case 'M':
        return Math.round((value / 1000000) * 10) / 10

      case 'B':
        return Math.round((value / 1000000000) * 10) / 10

      default:
        return value
    }
  } else if (value < 1000000) {
    switch (s) {
      case 'M':
        return Math.round((value / 1000000) * 10) / 10

      case 'K':
        return Math.round((value / 1000) * 10) / 10

      default:
        return value
    }
  } else {
    return value
  }
}
