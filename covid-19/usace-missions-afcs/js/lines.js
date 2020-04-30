Highcharts.setOptions({
  lang: {
      numericSymbols: null
  }
});

$(function() {
  $('#hcContainer').highcharts({
    // Load Data in from Google Sheets
    data: {
      googleSpreadsheetKey: '1OzJwZ8wTlflcKsb_yKfmGchhkAzUkQ-fexGwY-c-sAk',
      googleSpreadsheetWorksheet: 3
    },
    // General Chart Options
    chart: {
      zoomType: 'x',
      type: 'line'
    },
    // Colors
    colors: [
      '#365F5A',
      '#83373E'      
    ],
    // Chart Title and Subtitle
    title: {
      text: "Army Corps of Engineers: <br> Mission and Alternative Care Facilities"
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
        text: "Number of Missions and AFC Contracts"
      },
      labels: {
        formatter: function() {
            return Highcharts.numberFormat(this.value, 0, '.', ',');
        }
      }
    },
    xAxis: {
      dateTimeLabelFormats: {
        day: '%e-%b',
        week: '%e-%b'
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