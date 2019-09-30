/**
 * CSIS Defense360 Highcharts Theme
 *
 */

Highcharts.setOptions({
  lang: {
    thousandsSep: ","
  }
});

Highcharts.theme = {
  colors: [
    "#365F5A",
    "#96B586",
    "#DDB460",
    "#D05F4C",
    "#83373E",
    "#9B9B9B",
    "#3E8E9D",
    "#75657A",
    "#A2786A"
  ],
  chart: {
    backgroundColor: "#FFF",
    border: "none",
    color: "#000",
    plotShadow: false,
    height: 500
  },
  title: {
    style: {
      color: "#000",
      fontSize: "20px",
      fontFamily: "'Source Sans Pro', 'Arial', sans-serif",
      fontWeight: "400"
    },
    widthAdjust: -60
  },
  subtitle: {
    style: {
      fontSize: "14px",
      fontFamily: "'Source Sans Pro', 'Arial', sans-serif",
      color: "#808080"
    }
  },
  credits: {
    style: {
      cursor: "default",
      fontFamily: "'Source Sans Pro', 'Arial', sans-serif",
      fontSize: "10px"
    }
  },
  tooltip: {
    style: {
      fontSize: "14px",
      fontFamily: "'Source Sans Pro', 'Arial', sans-serif"
    },
    headerFormat:
      "<span style=\"font-size: 14px;text-align:center;margin-bottom: 5px;font-weight: bold;font-family: 'Source Sans Pro', arial, sans-serif;\">{point.key}</span><br/>"
  },
  xAxis: {
    labels: {
      style: {
        color: "#666",
        fontSize: "14px",
        fontFamily: '"expo-serif-pro",serif'
      }
    },
    title: {
      style: {
        color: "#666",
        fontSize: "16px",
        fontFamily: '"expo-serif-pro",serif'
      }
    },
    gridLineWidth: 1,
    lineWidth: 0,
    tickColor: "#e6e6e6"
  },
  yAxis: {
    labels: {
      style: {
        color: "#666",
        fontSize: "14px",
        fontFamily: '"expo-serif-pro",serif'
      },
      x: -3
    },
    title: {
      style: {
        color: "#666",
        fontSize: "16px",
        fontFamily: '"expo-serif-pro",serif'
      },
      margin: 20
    },
    tickColor: "#e6e6e6"
  },
  legend: {
    title: {
      text: null,
      style: {
        fontFamily: '"expo-serif-pro",serif',
        fontSize: "15px",
        color: "#000",
        fontStyle: "normal"
      }
    },
    itemStyle: {
      color: "#000",
      fontSize: "14px",
      fontFamily: "'Source Sans Pro', 'Arial', sans-serif",
      textOverflow: null
    },
    itemHoverStyle: {
      color: "#5db6d0"
    },
    margin: 30
  },
  drilldown: {
    activeAxisLabelStyle: {
      color: "#5db6d0"
    },
    activeDataLabelStyle: {
      color: "#5db6d0"
    }
  }
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
