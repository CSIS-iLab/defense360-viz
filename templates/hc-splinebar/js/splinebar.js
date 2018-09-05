$(function() {

  var data = {}
  var datasets
  var seriesData = []

  Highcharts.data({
    googleSpreadsheetKey: '1YvXIYCYaIIxqS19oHXDbd7VebrsHDssYXdcF8AftNFg',
      googleSpreadsheetWorksheet: 1,
      switchRowsAndColumns: true,
      parsed: function(columns) {
        $.each(columns, function (i, code) {
          if ( i == 0 ) {
            return
          }

          if (code[0] == 'column') {
            data[code[1]] = data[code[1]] || {
              type: code[0],
              name: code[1],
              data: []
            }
            data[code[1]].data.push({
              x: code[2],
              y: code[3]
            })

          } else if (code[0] == 'spline') {
            data[code[1]] = data[code[1]] || {
              type: code[0],
              name: code[1],
              yAxis: 1,
              data: [],
              marker: {
                enabled: false,
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[4],
                fillColor: 'white'
              }
            }

            data[code[1]].data.push({
              x: code[2],
              y: code[3]
            })

          }

        })

        datasets = Object.keys(data)

        // Convert object to array - we no longer need the keys
        var dataArray = $.map(data, function(value, index) {
            return [value];
        });

        renderChart(dataArray);

      }
  })


  function renderChart(data) {
    $('#hcContainer').highcharts({
      // General Chart Options
      chart: {
        zoomType: 'x',
      },
      // Chart Title and Subtitle
      title: {
        text: "China's Medal Count and GDP"
      },
      subtitle: {
        text: "Click and drag to zoom in"
      },
      // Credits
      credits: {
        position: {
          y: -15
        },
        enabled: true,
        href: false,
        text: "CSIS Defense360 | Source: Defense Budget Analysis"
      },
      // Chart Legend
      legend: {
        y: -15,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
      },
      // X Axis
      xAxis: {
        title: {
          text:"Year"
        },
        labels: {
          formatter: function () {
            if (this.value == '1992') {
              return this.value+'*';
            }
            return this.value;
          }
        },
        allowDecimals: false
      },
      // Y Axis
      yAxis: [{ // Primary yAxis
          labels: {
              style: {
                  color: Highcharts.getOptions().colors[1]
              }
          },
          title: {
              text: 'Total Medal Count',
              style: {
                  color: Highcharts.getOptions().colors[1]
              }
          },
          max: 350,
          tickInterval: 35,
          reversedStacks: false
      }, { // Secondary yAxis
          title: {
              text: 'GDP ($ Trillion)',
              style: {
                  color: Highcharts.getOptions().colors[4]
              }
          },
          labels: {
              style: {
                  color: Highcharts.getOptions().colors[4]
              }
          },
          max: 10,
          tickInterval: 1,
          opposite: true
      }],
      series: data,
      // Additional Plot Options
      plotOptions:
      {
        column: {
          stacking: "normal",
        }
      }
    });
  }
});
