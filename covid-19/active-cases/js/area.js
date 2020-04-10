
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
      text: "Active DoD Cases of COVID-19"
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
    // Y Axis
    yAxis: {
      title: {
        text: "Number of Cases"
      },
      reversedStacks: false
    },
    // Tooltip
    tooltip: {
      useHTML: true,
      formatter: function () {
        // Convert unix timestamp to javascript date
        var dateObj = new Date(this.x);
        // Remove time portion of date
        var date = dateObj.toDateString();
        // Convert date to array
        var dateArray = date.split(" ");
        // Create variable showing month and year
        var formattedDate = dateArray[1] + " " + dateArray[2] + ", " + dateArray[3];

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
