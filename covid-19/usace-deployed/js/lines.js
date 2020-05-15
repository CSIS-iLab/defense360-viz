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
      googleSpreadsheetWorksheet: 2
    },
    // General Chart Options
    chart: {
      zoomType: 'x',
      type: 'line'
    },
    // Colors
    colors: [
      '#83373E'      
    ],
    // Chart Title and Subtitle
    title: {
      text: "Army Corps of Engineers: <br> Personnel Deployed"
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
    // Y Axis
    yAxis: {
      title: {
        text: "Number of Personnel"
      },
      labels: {
        formatter: function() {
            return Highcharts.numberFormat(this.value, 0, '.', ',');
        }
      },
      tickInterval: 500
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%e-%b',
        week: '%e-%b'
      },
      labels: {
        style: {
            textOverflow: 'none'
        }
      },
      units: [
        [
          'day', 
          [1,2,3,5,7,10]
        ]
      ] 
    },
    // Tooltip
    tooltip: {
        shared: true,
        useHTML: true,
        xDateFormat: '%b %e, %Y'
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