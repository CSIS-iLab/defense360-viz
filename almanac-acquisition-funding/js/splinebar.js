Highcharts.chart('hcContainer', {
  data: {
    googleSpreadsheetKey: '1z3i0mILf9PGGhCh42lSh6BejOt9P3eolANl8ic0MnZA',
    googleSpreadsheetWorksheet: 2,
    switchRowsAndColumns: false,
    complete: function(d) {
      d.series = d.series.map(s => {
        return {
          ...s,
          type:
            s.name.toLowerCase().indexOf('budget') < 0 ? 'spline' : 'spline',
          yAxis: s.name.toLowerCase().indexOf('budget') < 0 ? 0 : 1
        }
      })

      console.log(d.series)
    }
  },
  chart: {
    zoomType: 'x'
  },
  title: {
    text: 'Army End Strength and Budget, FY 1975 to FY 2018'
  },
  subtitle: {
    text: 'Click and drag to zoom in'
  },
  credits: {
    position: {
      y: -15
    },
    enabled: true,
    href: false,
    text: 'CSIS Defense360 | Source: Defense Budget Analysis'
  },
  legend: {
    y: -15,
    align: 'center',
    verticalAlign: 'bottom',
    layout: 'horizontal',
    title: {
      text:
        '<span style="font-size: 12px; color: #808080; font-weight: normal">(Click to hide)</span>'
    }
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
      title: {
        text: 'Army End Strength'
      },
      labels: {
        format: '{value}K'
      },
      // max: 2000,
      reversedStacks: false
    },
    {
      title: {
        text: 'Discretionary & Mandatory Budget Authority (in FY19 Dollars)',
        rotation: -90,
        style: {
          color: Highcharts.getOptions().colors[4]
        }
      },
      labels: {
        style: {
          color: Highcharts.getOptions().colors[4]
        },
        format: '${value}B'
      },
      // max: 300,
      opposite: true
    }
  ],
  tooltip: {
    formatter: function() {
      var unit
      var chartType = this.series.userOptions.type
      var rounded = Number(Math.round(this.y + 'e2') + 'e-2')

      if (chartType == 'spline') {
        unit = ' Billion'
      } else if (chartType == 'column') {
        unit = 'k'
      }
      return (
        '<b>' +
        this.key +
        '</b>' +
        '<br/><span style="color:' +
        this.series.color +
        '">● </span>' +
        this.series.name +
        ': ' +
        rounded +
        unit
      )
    }
  },
  plotOptions: {
    column: {
      stacking: 'normal'
    },
    spline: {
      marker: {
        enabled: false,
        lineWidth: 2,
        lineColor: Highcharts.getOptions().colors[4],
        fillColor: 'white'
      },
      lineWidth: 3
    }
  }
})
