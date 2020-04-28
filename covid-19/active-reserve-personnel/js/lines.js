$(function() {
  $('#hcContainer').highcharts({
    // Load Data in from Google Sheets
    data: {
      googleSpreadsheetKey: '1OzJwZ8wTlflcKsb_yKfmGchhkAzUkQ-fexGwY-c-sAk',
      googleSpreadsheetWorksheet: 1
    },
    // General Chart Options
    chart: {
      zoomType: 'x',
      type: 'line'
    },
    // Chart Title and Subtitle
    title: {
      text: "Active and Reserve Personnel in COVID-19 Response"
    },
    subtitle: {
      text: "Click and drag to zoom in"
    },
    // Credits
    credits: {
      enabled: true,
      href: false,
      text: "CSIS Defense360 | Source: Department of Defense"
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
        text: "Number of Personnel"
      }
    },
    // Tooltip
    
    tooltip: {
        shared: true,
        useHTML: true,
        xDateFormat: '%B %e'
    },    
    // Additional Plot Options
    plotOptions:
    {
      line: {
        marker: {
          enabled: false,
          symbol: "circle",
          radius: 3
        },
        lineWidth: 3
      }
    }
  });
});