Highcharts.chart('hcContainer', {
  data: {
    googleAPIKey: "AIzaSyBgDqxsDf6bkqy1_GV4rM6ejMCGcqzwzHU",
    googleSpreadsheetKey: '16cmspkQOI6riyOWyXc7ZkafRpWqYtMIMn3rHZeBoQ3Q',
    googleSpreadsheetWorksheet: 1,
    startColumn: 0,
    endColumn: 3,
    dateFormat: 'mm/dd/YYYY'
  },
  chart: {
    type: 'column',
    zoomType: 'xy'
  },
  colors: ['#D05F4C', '#365F5A'],
  title: {
    text: 'New DoD Cases of Covid-19'
  },
  subtitle: {
    text: "Click and drag to zoom in"
  },
  credits: {
    enabled: true,
    href: false,
    text: "CSIS Defense360 | Source: DoD Covid-19 Updates"
  },
  legend: {
    align: 'center',
    verticalAlign: 'bottom',
    layout: 'horizontal'
  },
  yAxis: {
    title: {
      text: "Number of Cases"
    }
  },
  xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%e-%b',
        week: '%e-%b'
      }
  },
  tooltip: {
    shared: true,
    useHTML: true,
    valueDecimals: 0,
    xDateFormat: '%b %e, %Y'
  },
  series: [{
    type: 'column',
    visible: false,
    showInLegend: false
  }, {
    type: 'column'
  }, {
    type: 'line',
    label: {
      enabled: false
    }
  }],
  plotOptions:{
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
