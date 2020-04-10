
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
      googleSpreadsheetWorksheet: 4
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
      text: "National Guard Activations"
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
      enabled: false,
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
        text: "Number of Activations"
      }
    },
    // Tooltip
    tooltip: {
      xDateFormat: '%b %e, %Y'
      // useHTML: true,
      // formatter: function () {
      //   // Convert unix timestamp to javascript date
      //   var dateObj = new Date(this.x);
      //   // Remove time portion of date
      //   var date = dateObj.toDateString();
      //   // Convert date to array
      //   var dateArray = date.split(" ");
      //   // Create variable showing month and year
      //   var formattedDate = dateArray[1] + " " + dateArray[2] + ", " + dateArray[3];

      //   let total = 0
      //   let lines = this.points.map((point, i) => {
      //     total += point.y
      //     return '<span style="color:' + point.color + '">● </span>' + point.series.name + ': <b>{point.y:,.0f}</b></br>'
      //   })
      //   return '<b>' + formattedDate + '</b></br>' + lines.toString().replace(/,/g, " ") + 'Total Active Cases: <b>' + total + '</b>'
      // },
      // shared: true,
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
