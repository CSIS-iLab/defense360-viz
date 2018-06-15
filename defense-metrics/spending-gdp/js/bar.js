$(function() {

  var data = {}
  var fiveWin = []
  var fiveLose = []

  Highcharts.data({
    googleSpreadsheetKey: '17Paq5u7wNkLkDgmhbGur15KBSWjG3JIjzNaLd5hRDvs',
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
            data[code[0]].data.push({
              name: code[1],
              y: code[2],
              label: code[0]
            })

        })

        // Convert object to array - we no longer need the keys
        var dataArray = $.map(data, function(value, index) {
            return [value];
        });

        renderChart(dataArray);

        //Get top five and last five countries
        var dataContent = dataArray[1].data;
        var woEu = dataContent.sort(function(a,b) {
          return b.y - a.y;
        });
        woEu.shift();
        fiveWin = woEu.slice(0,5);

        $('.top-container').append('<div style="margin-bottom: 3px;"><text style="color:#666;cursor:default;font-size:11px;font-family:Abel, Arial, sans-serif;fill:#666;"><b>Top 5 Avg. Spenders</b><br/><i>(Excl. EU Commission)</i>:</text></div>')

        fiveWin.map(function(e){
          $('.top-container').append('<text style="color:#666;cursor:default;font-size:11px;font-family:Abel, Arial, sans-serif;fill:#666;">' + e.name + ': ' + Number(Math.round(e.y + 'e3')+ 'e-3') + '%</text><br/>')
        })

      }
  })


  function renderChart(data) {
    $('#hcContainer').highcharts({
      // General Chart Options
      chart: {
        type: 'bar',
        spacingBottom: 46
      },
      // Chart Title and Subtitle
      title: {
        text: "Average Reported Security Assistance as Percent of GDP, 2013-2018"
      },
      /*
      subtitle: {
        text: "Excluding Luxembourg (856% increase)"
      },      */


      // Credits
      credits: {
        position: {
          y:-30
        },
        enabled: true,
        href: false,
        text: "*The EU Commission is included as a reference<br/>**Note that there is no Ministry of Defense spending in Iceland<br/>CSIS Defense360 | Source: CIA World Factbook, Finnish MOD Website"
      },
      // Chart Legend
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        margin: 5,
        itemMarginTop: 8,
      },
      // X Axis
      xAxis: {
        type: "category",
        scrollbar: {
            enabled: true
        },
        min:0,
        max:20,
        tickLength: 0,
        tickmarkPlacement: 'on',
        labels: {
          step: 1
        }
      },
      // Y Axis
      yAxis: {
        title: {
          text: "MOD & Security Expenditures as % of GDP"
        },
        labels: {
          format: '{value}%'
        },
        reversedStacks: false
      },
      series: data,
      // Tooltip
      tooltip: {
          /*
          formatter: function () {
            console.log(this);
              var rounded = Number(Math.round(this.y + 'e2')+ 'e-2');
              return '<span style="color:' + this.series.color + '">● </span><b>' + this.key + '</b><br/>' + this.point.label + ': ' + rounded + '%</i>';
          },          */

          valueSuffix: '%',
          valueDecimals: 3,
          positioner: function(boxWidth, boxHeight, point) {
              console.log(point);
              return {
                  x: point.plotX - 5,
                  y: point.plotY
              };
          },
          borderWidth: 0,
          backgroundColor: 'rgba(255,255,255,0.8)',
          shared: true
      },
      // Additional Plot Options
      plotOptions:{
        bar: {
          stacking: 'normal', // Normal bar graph
          // stacking: "normal", // Stacked bar graph
          dataLabels: {
              enabled: false,
          }
        }
      }
    });

  }

});
