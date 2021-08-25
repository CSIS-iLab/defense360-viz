  $(function () {
    $('#hcContainer').highcharts({
      // Load Data in from Google Sheets
      data: {
        googleSpreadsheetKey: '1eBpERcIQQAXDiA99uMDdEAWaXDC-EmWOlHgoiiihZMk',
        googleSpreadsheetRange: "Active Cases",
        dateFormat: 'mm/dd/YYYY'
      },
      // General Chart Options
      chart: {
        zoomType: 'x',
        type: 'area'
      },
      // Colors
      colors: ['#365F5A', '#83373E', '#D05F4C', '#96B586'],
      // Chart Title and Subtitle
      title: {
        text: "Cumulative Covid-19 Cases Across DoD"
      },
      subtitle: {
        text: "Click and drag to zoom in"
      },
      // Credits
      credits: {
        enabled: true,
        href: false,
        text: "CSIS Defense360 | Source: DoD Covid-19 Updates"
      },
      // Chart Legend
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
      },
      // xAxis
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%e-%b',
          week: '%e-%b'
        }
      },
      // Y Axis
      yAxis: {
        title: {
          text: "Number of Cases"
        },
        reversedStacks: false,
        labels: {
          formatter: function () {
            return Highcharts.numberFormat(this.value, 0, '.', ',')
          }
        }
      },
      // Tooltip
      tooltip: {
        useHTML: true,
        formatter: function () {
          let gmtDate = new Date(this.x)
          let dateObj = new Date(gmtDate.getTime() - gmtDate.getTimezoneOffset() * -60000)
          const dtf = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/New_York' })
          const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(dateObj)
          let formattedDate = `${mo} ${da}, ${ye}`

          let total = 0
          let lines = this.points.map((point, i) => {
            total += point.y
            return '<span style="color:' + point.color + '">● </span>' + point.series.name + ': <b>' + Highcharts.numberFormat(point.y,0, '.', ',')  + '</b></br>'
          })
          return '<b>' + formattedDate + '</b></br>' + lines.join("") + 'Total Active Cases: <b>' + Highcharts.numberFormat(total,0, '.', ',') + '</b>'
        },
        shared: true,
      },
      // Additional Plot Options
      plotOptions:
      {
        area: {
          marker: {
            enabled: false,
          },
          stacking: 'normal',
          lineWidth: 3
        }
      }
    });
  });
