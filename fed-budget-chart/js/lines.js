let allData = {};
let datasets = [];

Highcharts.setOptions({
  lang: {
    numericSymbols: ["k", "M", "B", "T", "P", "E"]
  }
})


Highcharts.data({
  // Load Data in from Google Sheets
  googleSpreadsheetKey: "1MCR0HCuxns-n3Q4ev10JnT9ugLh83GuuUYzK6X4kFgw",
  googleSpreadsheetWorksheet: 1,
  switchRowsAndColumns: true,
  parsed: function parsed(columns) {
    yearArray = columns[0];
    /* Note, currently, no data for year 1976 - data starts at 1977 */
    columns.shift();

    /*
      Iterate over each column, starting at the first one.
      Because of .shift() the first column contains values for
      out dataset, not the years.
    */

    for (let index = 0; index < columns.length; index++) {
      const row = columns[index];
      let dataset = row[0];
      let name = row[1];
      let values = [];

      /* rows 3 - 52 contain budget data, from 1976 - 2025 */

      /*
        Take the year and the data in that row and
        feed them in to be used as [x,y] values
      */
      for (let i = 3; i < 52; i++) {
        values.push([yearArray[i], row[i]]);
      }

      /*
        Since we are using the group name ("Discretionary Budget Authority by Function")
        as our "dataset" name, the lines below check whether it exists in our "allData"
        and if not, it adds it and its values. This lets the chart stay functional
        even if the researcher changes the names on the backend google sheet or adds
        new ones.
      */
      if (!allData[dataset]) {
        allData[dataset] = {
          name: dataset,
          values: [],
        };
      }

      /*
        Take the group name (dataset) and push in the values that 
        you created in lines 33-34, so now you have the group name,
        each agency/function in that group, and the [x,y] values for
        each of those agencies/functions.
      */
      allData[dataset].values.push({
        name,
        data: values,
      });
    }
    datasets = Object.values(allData);
    setUpDropdown(datasets);
    renderChart(datasets[1]);
  },
});

// If using the default Highcharts legend, this will
// change the line symbol to a circle that's colored
// according to the series color. 
Highcharts.seriesTypes.line.prototype.drawLegendSymbol =
  Highcharts.seriesTypes.area.prototype.drawLegendSymbol;

function renderChart(data) {

  /* So yAxis title updates each year */
  let firstObject = data.values[0]
  let coordinates = firstObject.data
  let currentYear = coordinates.slice(-5)[0][0]
  let xAxisMax = currentYear + 4

  /*---Chart options---*/
  Highcharts.chart("hcContainer", {
      exporting: {
        chartOptions: {
          credits: {
            enabled: true
          },
        }
      },
      chart: {
        width: 800,
        type: "line",
        zoomType: "xy",
        height: 400,
      },
      title: {
        text: null,
      },
      credits: {
        enabled: false,
        text: 'CSIS Defense 360 | Source: OMB'
      },
      yAxis: {
        title: {
          /* Use currentYear, defined above, to update */
          useHTML: true,
          text: `<b>Budget Authority in FY ${currentYear} Dollars</b>`
        },
        labels: {
          formatter: function () {

            if (this.value >= 1000000) {
              return '$' + (this.value / 1000000) + 'T';
            } else if (this.value >= 1000) {
              return '$' + (this.value / 1000) + 'B';
            } else if (this.value < -1000) {
              return '-$' + Math.abs((this.value / 1000)) + 'B'
            } else {
              return '$' + this.value;
            }
          }
        }
      },
      xAxis: {
        max: xAxisMax,
        maxPadding: 0,
        labels: {
          format: 'FY {value}',
          style: {
            fontSize: '11px'
          }
        },
        title: {
          text: "<b>Fiscal Year</b>",
          margin: 10
        },
      },
      legend: {
        enabled: false,
        align: 'right',
        verticalAlign: 'middle',
        width: '20%'
      },
      tooltip: {
        outside: true,
        useHTML: true,
        shared: false,
        valueDecimals: 3,
        headerFormat: '<span style="font-size: 14px"><b>FY {point.key}</b></span><br/>',
        pointFormatter: function () {
          var result = this.y
          if (result > 999999.99) {
            result = (result / 1000000).toFixed(2) + " Trillion"
          } else if (result > 999.99) {
            result = (result / 1000).toFixed(2) + " Billion"
          } else if (result > 0) {
            result = result.toFixed(2) + " Million"
          } else if (result < 0) {
            result = Math.abs((result / 1000)).toFixed(2) + " Billion"
            return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>-$' + result + '</b><br/>'
          }
          return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>$' + result + '</b><br/>'
        },
        style: {
          whitespace: 'normal'
        },
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false,
            symbol: "circle",
            radius: 3,
          },
          lineWidth: 1,
        },
      },
      series: data.values,
      },
      function (chart) {
        setUpButtons(chart)
        setUpCheckboxes(chart)
      });
}

function setUpDropdown(values) {
  const select = document.getElementById("dataset");
  let optionsHTML = "";

  values.forEach((element) => {
    if (`${element.name}` == "Discretionary Budget Authority by Agency") {
      optionsHTML += `<option value="${element.name}" selected>${element.name}</option>`
    } else {
      optionsHTML += `<option value="${element.name}">${element.name}</option>`;
    }
  });

  select.innerHTML = optionsHTML;

  select.addEventListener("change", function () {
    let chart = Highcharts.chart("hcContainer", {});
    chart.destroy();
    renderChart(allData[this.value]);
  });
}

function setUpButtons(chart) {
  let series = chart.series

  const selectAll = document.getElementById("select-all");
  const unselectAll = document.getElementById("unselect-all");

  selectAll.addEventListener("click", function () {
    for (let i = 0; i < series.length; i++) {
      series[i].setVisible(true, true);
      setUpCheckboxes(chart)
    }
  })

  unselectAll.addEventListener("click", function () {
    for (let i = 0; i < series.length; i++) {
      series[i].setVisible(false, false)
      setUpCheckboxes(chart)
    }
  })
}

function setUpCheckboxes(chart) {
  const checkboxes = document.getElementById("checkboxes")
  let series = chart.series
  let checkboxesHTML = ""

  for (let i = 0; i < series.length; i++) {
    let isChecked = series[i].visible ? 'checked' : ""
    checkboxesHTML += `
    <div class="checkbox__wrapper" style="--color: ${series[i].color}">
      <input type="checkbox" name="series" id="${i}" value="${i}" ${isChecked}/>
      <label for="${i}" class="checkbox-label">${series[i].name}</label>
    </div>`      
  }
  
  checkboxes.innerHTML = checkboxesHTML;

  /*---------Submit Button-------- */
  const submitButton = document.getElementById("submit")

  submitButton.addEventListener("click", function () {
    const checkedBoxes = Array.from(document.querySelectorAll('input[name=series]:checked'))
      .map(input => +input.value);

    for (let i = 0; i < series.length; i++) {
      if (checkedBoxes.includes(i)) {
        series[i].visible = true
      } else {
        series[i].setVisible(false, false)
      }
    }
    chart.redraw()
  })
}