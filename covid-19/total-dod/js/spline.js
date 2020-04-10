
$(function () {
  $('#hcContainer').highcharts({
    // Load Data in from Google Sheets
    data: {
      googleSpreadsheetKey: '1eBpERcIQQAXDiA99uMDdEAWaXDC-EmWOlHgoiiihZMk',
      googleSpreadsheetWorksheet: 3
    },
    // General Chart Options
    chart: {
      zoomType: 'x',
      type: 'spline'
    },
    // Colors
    colors: ['#75657A', '#3E8E9D', '#DDB460'],
    // Chart Title and Subtitle
    title: {
      text: "Total DoD Cases of COVID-19"
    },
    subtitle: {
      text: "Click and drag to zoom in"
    },
    // Credits
    credits: {
      enabled: true,
      href: false,
      text: "CSIS Defense360 | Source: NAME"
    },
    // Chart Legend
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal'
    },
    // xAxis
    xAxis: {
      dateTimeLabelFormats: {
        day: '%e-%b'
      }
    },
    // Y Axis
    yAxis: {
      title: {
        text: "Number of Cases"
      }
    },
    // Tooltip
    tooltip: {
      useHTML: true,
      formatter: function () {
        var dateObj = new Date(this.x);
        const dtf = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(dateObj)
        var formattedDate = `${mo} ${da}, ${ye}`

        let total = 0
        let lines = this.points.map((point, i) => {
          total += point.y
          return '<span style="color:' + point.color + '">● </span>' + point.series.name + ': <b>' + point.y + '</b></br>'
        })
        return '<b>' + formattedDate + '</b></br>' + lines.toString().replace(/,/g, " ") + 'Total DoD Cases: <b>' + total + '</b>'
      },
      shared: true
    },
    // Additional Plot Options
    plotOptions:
    {
      spline: {
        marker: {
          enabled: false,
          symbol: "circle",
          radius: 3
        },
        lineWidth: 3
      }
    },
    annotations: [{
      labels: [{
        useHTML: true,
        point: {
          x: 110,
          y: 55
        },
        style: {
          fontSize: '13px'
        },
        shape: 'rect',
        overflow: 'none',
        formatter: function () {
          console.log(this.series.chart.series)
          let total = 0
          let s = this.series.chart.series
          s.forEach((serie, i) => {
            console.log(serie)
            total += serie.points[serie.points.length - 1].y
          })
          let secDate = s[0].points[s[0].points.length - 1].x
          var dateObj = new Date(secDate);
          const dtf = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
          const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(dateObj)
          var formattedDate = `${mo}/${da}/${ye}`
          return 'Total Cases as of ' + formattedDate + ': <b>' + total + '</b>'
        }
      }],
      labelOptions: {
        borderRadius: 1,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#AAA'
      }
    }]
  });
});
