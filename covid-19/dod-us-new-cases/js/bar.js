Highcharts.chart("hcContainer", {
  // Load Data in from Google Sheets
  data: {
    googleSpreadsheetKey: "1eBpERcIQQAXDiA99uMDdEAWaXDC-EmWOlHgoiiihZMk",
    googleSpreadsheetRange: "Sheet5",
    dateFormat: 'mm/dd/YYYY'
  },

  // Data
  series: [
    {
      type: "column",
      yAxis: 0,
      data: [],
    },
    {
      type: "line",
      yAxis: 0,
      data: [],
      tooltip: {
        pointFormatter: function () {
          // console.log(this)
          return `<span style="color:${this.color}">\u25CF </span> ${this.series.name}:
          <b>` + Highcharts.numberFormat(this.y, 0, ".", ",") + `</b><br>`
        },
      }
    },
    {
      type: "line",
      yAxis: 1,
      data: [],
      tooltip: {
        pointFormatter: function () {
          return `<span style="color:${this.color}">\u25CF </span> ${this.series.name}: 
          <b>${this.y.toFixed(0)}</b><br>`;
        },
      }
    },
  ],

  // General Chart Options
  chart: {
    type: "column",
    spacingBottom: 60
  },
  // Chart Title and Subtitle
  title: {
    text: "Comparing New U.S. and DoD Case Trends",
  },
  subtitle: {
    text: "Different scales are used for comparison. Note dual axis.",
  },
  // Credits
  credits: {
    enabled: true,
    href: false,
    text:
      "CSIS Defense360<br>Source:Johns Hopkins Coronavirus Resource Center<br>& Coronavirus: DoD Response",
    position: {
      y: -30
    }
  },
  // Chart Legend
  legend: {
    title: {
      text:
        '<br/><span style="font-size: 12px; color: #808080; font-weight: normal">(Click to hide)</span>',
    },
    align: "center",
    verticalAlign: "bottom",
    layout: "horizontal",
  },
  // Y Axis
  yAxis: [
    {
      title: {
        text: "New U.S. Cases",
      },
    },
    {
      title: {
        text: "New DoD Cases",
      },
      opposite: true,
      max: 5500,
    },
  ],

  // Tooltip
  tooltip: {
    shared: true,
    xDateFormat: '%b %e, %Y'
  },
  // // X Axis
  // xAxis: {
  // },
  // Colors
  colors: ["#ddb460", "#3e8e9d", "#d05f4c"],
  // Additional Plot Options
  plotOptions: {
    column: {
      stacking: null, // Normal bar graph
      dataLabels: {
        enabled: false,
      },
    },
  },
});
