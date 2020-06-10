Highcharts.chart('hcContainer', {
  data: {
    googleSpreadsheetKey: '16cmspkQOI6riyOWyXc7ZkafRpWqYtMIMn3rHZeBoQ3Q',
    googleSpreadsheetWorksheet: 1,
    startColumn: 0,
    endColumn: 3,
    dateFormat: 'mm/dd/YYYY'
  },
  chart: {
    type: 'column',
    events: {
      render() {
        const chart = this;
        const series = chart.series;
        console.log(series);
      }
    }
  },
  title: {
    text: 'DoD New Cases of Covid-19'
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
    }, 
    labels: {
      style: {
          textOverflow: 'none'
      }
    },
    units: [
      [
        'day', 
        [1,2,3,5,7]
      ]
    ] 
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
