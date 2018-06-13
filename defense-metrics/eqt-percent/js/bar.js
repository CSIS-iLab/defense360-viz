$(function() {
  $('#hcContainer').highcharts({
    // Load Data in from Google Sheets
    data: {
      googleSpreadsheetKey: '1q1q47_2LnWz3EfTZcedhtsNuzjQ-wTbtPxc77cs_nyU',
      googleSpreadsheetWorksheet: 1
    },
    // General Chart Options
    chart: {
      type: 'bar',
      spacingBottom: 46
    },
    // Chart Title and Subtitle
    title: {
      text: "Distribution of Defense Expenditure by Main Category"
    },
    subtitle: {
      text: "Scroll to view additional countries"
    },
    // Credits
    credits: {
      enabled: true,
      position: {
        y:-30
      },
      href: false,
      text: "*Bulgaria defense expenditure does not include pensions<br/>**Data for included partner countries (Austria, Finland, Sweden) based on 2014 expenditures as reported by the European Defence Agency<br/>CSIS Defense360 | Source: NATO, European Defence Agency"
    },
    // Chart Legend
    legend: {
      title: {
          text: '<span style="font-size: 9px; color: #666; font-weight: normal">(Click to hide)</span>',
          style: {
              fontStyle: 'italic'
          }
      },
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      margin: 5,
      itemMarginTop: 8,
    },
    // X Axis
    xAxis: {
      scrollbar: {
          enabled: true
      },
      min:0,
      max:15,
      tickLength: 0
    },
    // Y Axis
    yAxis: {
      title: {
        text: "Percentage of Total Defense Expenditure<br/>(Based on 2017 Estimates Unless Otherwise Specified)",
        margin: 10
      },
      max: 100,
      reversedStacks: false
    },
    // Tooltip
    tooltip: {
      valueSuffix: '%',
      shared: true
    },
    // Additional Plot Options
    plotOptions:
    {
      bar: {
        stacking: 'normal', // Normal bar graph
        // stacking: "normal", // Stacked bar graph
        dataLabels: {
            enabled: false,
        }
      }
    }
  });
});
