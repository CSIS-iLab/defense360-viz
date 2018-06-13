$(function() {

  var data = {}
  var drilldownData = {}

  Highcharts.data({
    googleSpreadsheetKey: '1TOnIBxnQouO0HkqGwYUFu42JR6X7Kcuzs-dYE2Pq89Q',
      googleSpreadsheetWorksheet: 1,
      switchRowsAndColumns: true,
      parsed: function(columns) {
        $.each(columns, function (i, code) {
          if ( i == 0 ) {
            return
          }

          if (code[4] == 'drilldown') {
            drilldownData[code[5]] = drilldownData[code[5]] || {
              id: code[5],
              data: []
            }
            drilldownData[code[5]].data.push([code[6],code[7]])

          } else {
            data[code[0]] = data[code[0]] || {
              name: code[0],
              colorByPoint: true,
              data: []
            }
            data[code[0]].data.push({
              name: code[1],
              y: code[2],
              drilldown: code[3]
            })

          }


        })

        // Convert object to array - we no longer need the keys
        var dataArray = $.map(data, function(value, index) {
            return [value];
        });
        var drilldownArray = $.map(drilldownData, function(value, index) {
            return [value];
        });

        renderChart(dataArray, drilldownArray);

      }
  })

  function renderChart(data, subdata) {
    $('#hcContainer').highcharts({
      // General Chart Options
      chart: {
        zoomType: 'x',
        type: 'column',
        events: {
          drilldown: function(e) {
            this.xAxis[0].setTitle({ text:this.ddDupes[0] });
            this.yAxis[0].setTitle({ text:'Percent'});
          },
          drillup: function(e) {
            this.xAxis[0].setTitle({ text:"Countries" });
            this.yAxis[0].setTitle({ text:"Percent" });
          }
        }
      },
      // Chart Title and Subtitle
      title: {
        text: "Interactive Title"
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
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
      },
      // X Axis
      xAxis: {
        title: {
          text: 'Countries'
        },
        type: 'category'
      },
      // Y Axis
      yAxis: {
        title: {
          text: 'Percent'
        },
        plotLines: [{
          value: 20,
          color: '#d05133',
          width: 2
        }]
      },
      series: data,
      drilldown: {
        series: subdata,
      },
      // Tooltip
      /*
      tooltip: {
          formatter: function () {
              return '<span style="color:' + this.series.color + '">● </span><b>' + this.point.series.name + '</b><br> x: ' + this.x + ' y: ' + this.y + '<br><i>x: ' + this.x + ' y: ' + this.y + '</i><br><b>x: ' + this.x + ' y: ' + this.y + '</b>';
          }
      },    */
      // Additional Plot Options
      plotOptions:
      {
        column: {
          stacking: null, // Normal bar graph
          // stacking: "normal", // Stacked bar graph
          dataLabels: {
              enabled: false,
          }
        }
      }
    });
  }
});
