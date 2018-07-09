$(function() {

  var data = {}
  var fiveWin = []
  var fiveActual = ['$618B', '$59B', '$51B', '$48B', '$24B']

  Highcharts.data({
    // Load Data in from Google Sheets
    googleSpreadsheetKey: '1tB3mPWfNDwpItnwHcWZ_4eM1RL2vsRnHF9RndAVHZYI',
      googleSpreadsheetWorksheet: 1,
      switchRowsAndColumns: true,
      parsed: function(columns) {
        $.each(columns, function (i, code) {
          if ( i == 0 ) {
            return
          }
            data[code[0]] = data[code[0]] || {
              name: code[0],
              colorByPoint: false,
              data: []
            }
            if (code[1] == 'Finland'|| code[1] =='Georgia'||code[1] =='Moldova'||code[1] =='Sweden'||code[1] =='Ukraine'||code[1] =='Austria') {
              data[code[0]].data.push({
                name:code[1],
                y:code[2],
                color:'#97b488'
              })
            } else {
              data[code[0]].data.push({
                name:code[1],
                y:code[2],
                color: '#385e5a'
              })
            }


        })

        // Convert object to array - we no longer need the keys
        var dataArray = $.map(data, function(value, index) {
            return [value];
        });

        //Get top five and last five countries
        var dataContent1 = dataArray[0].data;
        var dataContent2 = dataArray[1].data;
        var topFiveTitle = 'Top 5 Spenders'

        var dataContent3 = dataContent1.concat(dataContent2);
        dataContent3.sort(function(a,b){
          return b.y - a.y;
        })
        fiveWin = dataContent3.slice(0,5);

        for(var i = 0; i <= fiveWin.length - 1; i++) {
          fiveWin[i].actual = fiveActual[i]
        }

        renderChart(dataArray);

        // $('.top-container').append('<text style="color:#666;cursor:default;font-size:12px;font-family: \'Source Sans Pro\', Arial, sans-serif;fill:#666;"><b>' + topFiveTitle + '</b></text><br/>')

        // fiveWin.map(function(e){
        //   $('.top-container').append('<text style="color:#666;cursor:default;font-size:12px;font-family: \'Source Sans Pro\', Arial, sans-serif;fill:#666;">' + e.name + ': ' + e.actual + '</text><br/>')
        // })

      }

  })


  function renderChart(data) {
    $('#hcContainer').highcharts({
      // General Chart Options
      chart: {
        type: 'column',
      },
      // Chart Title and Subtitle
      title: {
        text: "Defense Expenditure as a Share of GDP"
      },
      // Export Menu
      navigation: {
        buttonOptions: {
          align: 'left',
        }
      },
      // Credits
      credits: {
        enabled: true,
        href: false,
        text: "CSIS Defense360 | Source: NATO, The Military Balance 2018"
      },
      // Chart Legend
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
      },
      // X Axis
      xAxis: {
        title: {
          text: "Countries"
        },
        type: "category",
        tickmarkPlacement: 'on',
        labels: {
          rotation: -45,
          step: 1
        }
      },
      // Y Axis
      yAxis: {
        title: {
          text: "Percent Share of Real GDP (Based on 2017 Estimates for Defense Expenditures)"
        },
        plotLines: [{
          value: 2,
          color: '#d05133',
          width: 1.5,
          zIndex: 5,
        }],
        labels: {
          formatter: function () {
            if (this.value === 2){
              return '<span style="fill: #d05133;">'+ this.value +'%</span>';
            } else {
              return this.value + '%';
            }
          }
        }
      },
      series: data,
      // Tooltip
      tooltip: {
          formatter: function () {

              var category;

              if (this.color == '#97b488') {
                category = 'NATO Partners'
              } else if (this.color == '#385e5a') {
                category = 'NATO'
              }
              return '<span style="color:' + this.color + '">● </span>' + category + '<br><b>' + this.key + ':</b> ' + this.y +'%';
          }
      },
      // Additional Plot Options
      plotOptions:
      {
        column: {
          grouping: false,
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
