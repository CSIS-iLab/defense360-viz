
$(function () {
  Highcharts.setOptions({
    lang: {
      thousandsSep: ','
    },
  })
  $('#hcContainer').highcharts({
    // Load Data in from Google Sheets
    data: {
      googleSpreadsheetKey: '1eBpERcIQQAXDiA99uMDdEAWaXDC-EmWOlHgoiiihZMk',
      googleSpreadsheetRange: "National Guard Activations",
      dateFormat: 'mm/dd/YYYY'
    },
    // General Chart Options
    chart: {
      zoomType: 'x',
      type: 'area'
    },
    // Colors
    colors: ['#3E8E9D'],
    // Chart Title and Subtitle
    title: {
      text: "National Guard Activations in Response to Covid-19"
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
      enabled: false,
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
        text: "Number of Activations"
      },
      labels: {
        formatter: function () {
          return Highcharts.numberFormat(this.value, 0, '.', ',')
        }
      }
    },
    // Tooltip
    tooltip: {
      xDateFormat: '%b %e, %Y'
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
