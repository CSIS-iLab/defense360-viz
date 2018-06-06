$(function() {

  var data = {}
  var fiveWin = []
  var fiveLose = []

  Highcharts.data({
    googleSpreadsheetKey: '1cXkZZeQQ8Ztlp_p1VGUhbRlBMf_ulNFA9IqVTJzd3eA',
      googleSpreadsheetWorksheet: 1,
      switchRowsAndColumns: true,
      parsed: function(columns) {
        $.each(columns, function (i, code) {
          if ( i == 0 ) {
            return
          }

            data[code[0]] = data[code[0]] || {
              name: code[0],
              data: []
            }
            data[code[0]].data.push([code[1], code[2]*100])

        })

        // Convert object to array - we no longer need the keys
        var dataArray = $.map(data, function(value, index) {
            return [value];
        });

        //Get top five and last five countries
        var dataContent = dataArray[0].data;
        var lastDatum = dataContent.length;
        fiveWin = dataContent.slice(0,5);
        fiveLose = dataContent.slice(lastDatum-5,lastDatum).reverse();

        renderChart(dataArray);

        $('.top-container').append('<text style="color:#666;cursor:default;font-size:12px;font-family:Abel, Arial, sans-serif;fill:#666;"><b>Top 5 % increase</b></text><br/>')

        fiveWin.map(function(e){
          $('.top-container').append('<text style="color:#666;cursor:default;font-size:12px;font-family:Abel, Arial, sans-serif;fill:#666;">' + e[0] + ': ' + Number(Math.round(e[1] + 'e2')+ 'e-2') + '%</text><br/>')
        })

        $('.low-container').append('<text style="color:#666;cursor:default;font-size:12px;font-family:Abel, Arial, sans-serif;fill:#666;"><b>Top 5 % decrease</b></text><br/>')

        fiveLose.map(function(e){
          $('.low-container').append('<text style="color:#666;cursor:default;font-size:12px;font-family:Abel, Arial, sans-serif;fill:#666;">' + e[0] + ': ' + Number(Math.round(e[1] + 'e2')+ 'e-2') + '%</text><br/>')
        })
      }
  })


  function renderChart(data) {
    $('#hcContainer').highcharts({
      // General Chart Options
      chart: {
        type: 'column'
      },
      // Chart Title and Subtitle
      title: {
        text: "Percent Change in Imports/Exports with Iran, 2013-2016"
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
      // X Axis
      xAxis: {
        title: {
          text: "Country"
        },
        type: "category"
      },
      // Y Axis
      yAxis: {
        title: {
          text: "Total Percent Change"
        },
        labels: {
          format: '{value}%'
        }
      },
      series: data,
      // Tooltip
      tooltip: {
          formatter: function () {
              var rounded = Number(Math.round(this.y + 'e2')+ 'e-2');
              return '<span style="color:' + this.series.color + '">● </span><b>' + this.key + '</b><br/>Total Change: ' + rounded + '%</i>';
          }
      },
      // Additional Plot Options
      plotOptions:{
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
