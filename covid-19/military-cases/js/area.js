
$(function () {
  $('#hcContainer').highcharts({
    // Load Data in from Google Sheets
    data: {
      googleSpreadsheetKey: '1eBpERcIQQAXDiA99uMDdEAWaXDC-EmWOlHgoiiihZMk',
      googleSpreadsheetWorksheet: 2,
      dateFormat: 'mm/dd/YYYY'
    },
    // General Chart Options
    chart: {
      zoomType: 'x',
      type: 'area'
    },
    // Colors
    colors: ['#96B586', '#3E8E9D', '#365F5A', '#83373E', '#D05F4C'],
    // Chart Title and Subtitle
    title: {
      text: "Active Military Cases of Covid-19"
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
        const dtf = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(dateObj)
        let formattedDate = `${mo} ${da}, ${ye}`

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
