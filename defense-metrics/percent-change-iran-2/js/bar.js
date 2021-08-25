$(function() {

  var data = []
  var fiveWin = []
  var fiveLose = []

  Highcharts.data({
    googleAPIKey: "AIzaSyBgDqxsDf6bkqy1_GV4rM6ejMCGcqzwzHU",
    googleSpreadsheetKey: '1cXkZZeQQ8Ztlp_p1VGUhbRlBMf_ulNFA9IqVTJzd3eA',
      googleSpreadsheetRange: "Sheet1",
      switchRowsAndColumns: true,
      parsed: function(columns) {
        $.each(columns, function (i, code) {
          if ( i == 0 ) {
            data.push({
              name: "1",
              data:[]
            })
            return
          }
          data[0].data.push([code[1], code[2]*100, code[3]])
        })

        renderChart(data);

        //Get top five and last five countries
        const dataContent = data[0].data;
        var lastDatum = dataContent.length;

        var sortedByDollar = dataContent.slice().sort(function(a,b){
          return b[2] - a[2];
        })

        fiveWin = sortedByDollar.slice(0,5);
        fiveLose = sortedByDollar.slice(lastDatum-5,lastDatum).reverse();

        $('.container').append('<div style="color:#9b9b9b;font-size:11px;">(Millions of USD)</div>')

        $('.top-container').append('<text style="color:#666;cursor:default;font-size:12px;font-family: \'Source Sans Pro\', Arial, sans-serif;fill:#666;"><b>Top 5, $ increase</b></text><br/>')

        fiveWin.map(function(e){
          $('.top-container').append('<text style="color:#666;cursor:default;font-size:12px;font-family: \'Source Sans Pro\', Arial, sans-serif;fill:#666;">' + e[0] + ': ' + Number(Math.round(e[2] + 'e2')+ 'e-2').toLocaleString() + '</text><br/>')
        })

        $('.low-container').append('<text style="color:#666;cursor:default;font-size:12px;font-family: \'Source Sans Pro\', Arial, sans-serif;fill:#666;"><b>Top 5, $ decrease</b></text><br/>')

        fiveLose.map(function(e){
          $('.low-container').append('<text style="color:#666;cursor:default;font-size:12px;font-family: \'Source Sans Pro\', Arial, sans-serif;fill:#666;">' + e[0] + ': ' + Number(Math.round(e[2] + 'e2')+ 'e-2').toLocaleString() + '</text><br/>')
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
      /*
      subtitle: {
        text: "Excluding Luxembourg (856% increase)"
      },      */
      navigation: {
        buttonOptions: {
          align: 'left',
        }
      },
      // Credits
      credits: {
        enabled: true,
        href: false,
        text: "CSIS Defense360 | Source: <a href='http://data.imf.org/?sk=9D6028D4-F14A-464C-A2F2-59B2CD424B85&sId=1514498277103'>IMF</a>"
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
          text: "Country"
        },
        type: "category",
        labels: {
          step: 1,
          rotation: -45
        },
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
              return '<span style="color:' + this.series.color + '">● </span><b>' + this.key + '</b><br/>Total Change: ' + rounded + '%</i><br>$ Difference: ' + data[0].data[this.x][2].toLocaleString();
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
