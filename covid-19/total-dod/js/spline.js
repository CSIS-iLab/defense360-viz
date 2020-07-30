Highcharts.setOptions({
  lang: {
    thousandsSep: ",",
  },
});
Highcharts.chart("hcContainer", {
  // Load Data in from Google Sheets
  data: {
    googleSpreadsheetKey: "1eBpERcIQQAXDiA99uMDdEAWaXDC-EmWOlHgoiiihZMk",
    googleSpreadsheetWorksheet: 3,
    dateFormat: "mm/dd/YYYY",
  },
  // General Chart Options
  chart: {
    zoomType: "x",
    type: "spline",
  },
  // Colors
  colors: ["#75657A", "#3E8E9D", "#DDB460", "#D05F4C"],
  // Chart Title and Subtitle
  title: {
    text: "Cumulative DoD Cases of Covid-19",
  },
  subtitle: {
    text: "Click and drag to zoom in",
  },
  // Credits
  credits: {
    enabled: true,
    href: false,
    text: "CSIS Defense360 | Source: DoD Covid-19 Updates",
  },
  // Chart Legend
  legend: {
    align: "center",
    verticalAlign: "bottom",
    layout: "horizontal",
  },
  // xAxis
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      day: "%e-%b",
      week: "%e-%b",
    },
  },
  // Y Axis
  yAxis: {
    title: {
      text: "Number of Cases",
    },
    labels: {
      formatter: function () {
        return Highcharts.numberFormat(this.value, 0, ".", ",");
      },
    },
  },
  // Tooltip
  tooltip: {
    shared: true,
    xDateFormat: "%b %e, %Y",
  },
  // Additional Plot Options
  plotOptions: {
    spline: {
      marker: {
        enabled: false,
        symbol: "circle",
        radius: 3,
      },
      lineWidth: 3,
    },
  },
  annotations: [
    {
      labels: [
        {
          useHTML: true,
          point: {
            x: 110,
            y: 55,
          },
          style: {
            fontSize: "13px",
          },
          shape: "rect",
          overflow: "none",
          formatter: function () {
            let s = this.series.chart.series;
            let total = s[0].points[s[0].points.length - 1].y;

            let secDate = s[0].points[s[0].points.length - 1].x;
            let gmtDate = new Date(secDate);
            let dateObj = new Date(
              gmtDate.getTime() - gmtDate.getTimezoneOffset() * -60000
            );
            const dtf = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            });
            const [
              { value: mo },
              ,
              { value: da },
              ,
              { value: ye },
            ] = dtf.formatToParts(dateObj);
            let formattedDate = `${mo}/${da}/${ye}`;
            return (
              "Total Cases as of " +
              formattedDate +
              ": <b>" +
              Highcharts.numberFormat(total, 0, ".", ",") +
              "</b>"
            );
          },
        },
      ],
      labelOptions: {
        borderRadius: 1,
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#AAA",
      },
    },
  ],
});
