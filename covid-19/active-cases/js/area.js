
$(function () {
  $('#hcContainer').highcharts({
    // Load Data in from Google Sheets
    data: {
      googleSpreadsheetKey: '1eBpERcIQQAXDiA99uMDdEAWaXDC-EmWOlHgoiiihZMk',
      googleSpreadsheetWorksheet: 1
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
      text: "Active DoD Cases of Covid-19"
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
      dateTimeLabelFormats: {
        day: '%e-%b'
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
        var dateObj = new Date(this.x);
        const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' })
        const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(dateObj)
        var formattedDate = `${mo} ${da}, ${ye}`

        let total = 0
        let lines = this.points.map((point, i) => {
          total += point.y
          return '<span style="color:' + point.color + '">● </span>' + point.series.name + ': <b>' + point.y + '</b></br>'
        })
        return '<b>' + formattedDate + '</b></br>' + lines.toString().replace(/,/g, " ") + 'Total Active Cases: <b>' + total + '</b>'
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
