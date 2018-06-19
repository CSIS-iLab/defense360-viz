$(function() {

  var data = {}
  var datasets
  var seriesData = []

  Highcharts.data({
    googleSpreadsheetKey: '1-IGYBU2hIXOEFCQN7JkGaJRwWFM1-ZecGfzZw5-feGQ',
      googleSpreadsheetWorksheet: 1,
      switchRowsAndColumns: true,
      parsed: function(columns) {
        $.each(columns, function (i, code) {
          if ( i == 0 ) {
            return
          }

          data[code[0]] = data[code[0]] || {}
          data[code[0]][code[1]] = data[code[0]][code[1]] || {
            name: code[0],
            data: []
          }

          data[code[0]][code[1]].data.push({
            name: code[2],
            y: code[3],
            label: code[0]
          })

        })

        datasets = Object.keys(data)

        // Convert object to array - we no longer need the keys
        var dataArray = $.map(data, function(value, index) {
            return [value];
        });

        // Convert each series into an array
        dataArray.forEach(function(value) {
          var series = $.map(value, function(value2, index2) {
              return [value2];
          });
          seriesData.push(series)
        })
        var title = 'Average Refugees per Year'

        populateSelect()
        renderChart(seriesData[0],title)

      }
  })

  function populateSelect() {
    var options = '';
    $.each(datasets, function(i, dataset) {
      options += '<option value="'+ i + '">' + dataset + '</option>';
    })
    $('.datasets').append(options);

    // Destroy & redraw chart so we get smooth animation when switching datasets.
    $('.datasets').on('change', function() {
      var chart = $('#hcContainer').highcharts()
      chart.destroy()
      if (seriesData[this.value][0].name=='Avg. Per 100k') {
        title = 'Average per 100,000 People per Year';
      } else if (seriesData[this.value][0].name=='Average') {
        title = 'Average Refugees per Year';
      }
      renderChart(seriesData[this.value],title)
    })
  }

  function renderChart(data,title) {
    $('#hcContainer').highcharts({
      // General Chart Options
      chart: {
        type: 'bar',
        zoomType: 'x',
        spacingBottom: 30,
        height: 600
      },
      // Chart Title and Subtitle
      title: {
        text: title
      },
      subtitle: {
        text: "Click and drag chart to zoom."
      },
      // Credits
      credits: {
        enabled: true,
        href: false,
        text: "CSIS Defense360 | Refugee Source: <a href='http://data.un.org/Data.aspx?d=UNHCR&f=indID%3AType-Ref'>UNHCR</a> | Population Source: <a href='https://data.worldbank.org/indicator/SP.POP.TOTL?year_high_desc=true'>World Bank</a>"
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
          text: 'Country'
        },
        type: 'category',
        tickmarkPlacement: 'on',
        labels: {
          step: 1
        },
      },
      // Y Axis
      yAxis: {
        title: {
          text: "Average Number of Refugees"
        },
        labels: {
          formatter: function () {
            if (title == 'Average Refugees per Year') {
              var num = this.value/1000000;
              return num + 'm'
            } else {
              return this.value
            }
          },
        }
      },
      series: data,
      // Tooltip
      tooltip: {
          formatter: function () {
              var rounded = Number(Math.round(this.y+'e2')+'e-2');
              rounded = rounded.toLocaleString()
              return '<span style="color:' + this.series.color + '">● </span><b>' + this.key + '</b><br>' + this.point.options.label + ': ' + rounded + ' Refugees';
          }
      },
      // Additional Plot Options
      plotOptions:
      {
        bar: {
          stacking: false,
        }
      }
    });
  }
});
