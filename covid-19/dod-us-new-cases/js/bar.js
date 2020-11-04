Highcharts.chart("hcContainer", {
  // Load Data in from Google Sheets
  data: {
    googleSpreadsheetKey: "1eBpERcIQQAXDiA99uMDdEAWaXDC-EmWOlHgoiiihZMk",
    googleSpreadsheetWorksheet: 5,
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
          <b>` + Highcharts.numberFormat(this.y, 0, ".", ",") +  `</b><br>`
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
  },
  // Chart Title and Subtitle
  title: {
    text: "Comparing New US and DoD Case Trends",
  },
  subtitle: {
    text: "Different scales are used for comparison. Note dual axis.",
  },
  // Credits
  credits: {
    enabled: true,
    href: false,
    text:
      "CSIS Defense360 | Source:Johns Hopkins Coronavirus Resource Center & Coronavirus: DoD Response",
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
        text: "New Cases",
      },
    },
    {
      title: {
        text: "New DoD Cases",
      },
      opposite: true,
      max: 2500,
    },
  ],

  // Tooltip
  tooltip: {
    shared: true,
    xDateFormat: '%b %e, %Y'
  },
  // X Axis
  xAxis: {
    labels: {
      rotation: -90
  }
  },
  // Colors
  colors: ["#36605a", "#D05F4C", "#83373E"],
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