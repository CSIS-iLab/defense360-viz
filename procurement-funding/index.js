// Reference: http://jsfiddle.net/9fyrecy1/28/
// Reference: http://jsfiddle.net/highcharts/3mn2Lf0t/3/
// Polyfills: https://hackernoon.com/polyfills-everything-you-ever-wanted-to-know-or-maybe-a-bit-less-7c8de164e423
/**

  POLYFILLS NEEDED:
  - includes
  - Object.values//
  - findIndex
  */

import Highcharts from "./js/highcharts.js";
import { csv } from "d3-fetch";
import dataCSV from "./js/data.csv";

const valueTypesInfo = {
  current: {
    dropdown: "Current",
    yAxis: "Current"
  },
  constant: {
    dropdown: "Constant FY19",
    yAxis: "Constant FY19"
  }
};
const valueTypes = ["current", "constant"];
const colors = [
  "#365F5A",
  "#96B586",
  "#DDB460",
  "#D05F4C",
  "#83373E",
  "#9B9B9B",
  "#3E8E9D",
  "#75657A",
  "#A2786A"
];

var data = {
  current: {},
  constant: {}
};
var datasets;
var seriesData = {};
var years = [];

var drilldownData = {
  current: {},
  constant: {}
};

let currentType = "constant";
let chart;

function populateSelect() {
  var options = "";
  datasets.forEach(function(dataset, i) {
    options +=
      '<option value="' +
      dataset +
      '">' +
      valueTypesInfo[dataset].dropdown +
      " Dollars</option>";
  });
  let select = document.querySelector(".datasets");
  select.innerHTML = options;

  select.addEventListener("change", function() {
    currentType = this.value;
    chart.destroy();
    renderChart(seriesData[currentType]);
  });
}
function titleize(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
}

function createDrilldownObjects({
  rootObj,
  parentSlug,
  parentName,
  childSlug,
  year,
  value,
  drilldown,
  title,
  path
}) {
  let parentIndex = rootObj.findIndex(d => d.id === parentSlug);
  if (parentIndex === -1) {
    rootObj.push({
      title: title,
      path: path,
      name: parentName,
      id: parentSlug,
      drilldownID: parentSlug,
      data: [
        {
          name: "Fiscal Year " + year,
          id: childSlug,
          drilldownID: parentSlug,
          drilldown: drilldown,
          y: value
        }
      ]
    });
  } else {
    let childIndex = rootObj[parentIndex].data.findIndex(
      d => d.id === childSlug
    );

    if (childIndex > -1) {
      rootObj[parentIndex].data[childIndex].y += value;
    } else {
      rootObj[parentIndex].data.push({
        name: "Fiscal Year " + year,
        id: childSlug,
        drilldownID: parentSlug,
        drilldown: drilldown,
        y: value
      });
    }
  }
}

csv(dataCSV).then(function(rows) {
  rows.forEach(function(code, i) {
    var level1 = titleize(code.level1);
    var level2 = titleize(code.level2);
    var level3 = titleize(code.level3);
    var level4 = titleize(code.level4);
    var year = code.Year;

    const valueTypesColumns = {
      current: +code.current,
      constant: +code.constant
    };

    if (!years.includes(year)) {
      years.push(year);
    }

    valueTypes.forEach(function(type, index) {
      const level1Slug = slugify([year, level1]);
      const level1ID = slugify([level1]);

      data[type][level1] = data[type][level1] || {
        name: "Overview",
        path: level1,
        title: level1,
        colorByPoint: false,
        data: {}
      };

      data[type][level1].data[level1Slug] = data[type][level1].data[
        level1Slug
      ] || {
        id: level1ID,
        drilldownID: level1ID,
        name: "Fiscal Year " + year,
        drilldown: true,
        y: 0
      };

      data[type][level1].data[level1Slug].y += valueTypesColumns[type];

      // Drilldowns
      let level2Slug = slugify([level1, level2]);
      let level3Slug = slugify([year, level2Slug]);
      let level3ID = slugify([level2Slug, level3]);
      let level4Slug = slugify([level3Slug, level4]);
      let level4ID = slugify([level3ID, level4]);

      drilldownData[type][level1ID] = drilldownData[type][level1ID] || [];
      createDrilldownObjects({
        rootObj: drilldownData[type][level1ID],
        parentSlug: level2Slug,
        path: level1 + " » " + level2,
        title: level2,
        parentName: level1,
        childSlug: level3Slug,
        year: year,
        value: valueTypesColumns[type],
        drilldown: true
      });

      drilldownData[type][level2Slug] = drilldownData[type][level2Slug] || [];
      createDrilldownObjects({
        rootObj: drilldownData[type][level2Slug],
        parentSlug: level3ID,
        path: level1 + " » " + level2 + " » " + level3,
        title: level3,
        parentName: level2,
        childSlug: level3Slug,
        year: year,
        value: valueTypesColumns[type],
        drilldown: true
      });

      drilldownData[type][level3ID] = drilldownData[type][level3ID] || [];
      createDrilldownObjects({
        rootObj: drilldownData[type][level3ID],
        parentSlug: level4ID,
        path: level1 + " » " + level2 + " » " + level3 + " » " + level4,
        title: level4,
        parentName: level3,
        childSlug: level4Slug,
        year: year,
        value: valueTypesColumns[type],
        drilldown: false
      });
    });
  });

  datasets = Object.keys(data);

  valueTypes.forEach(function(type, index) {
    seriesData[type] = Object.keys(data[type]).map(p => {
      data[type][p].data = Object.values(data[type][p].data);
      return data[type][p];
    });
  });

  populateSelect();
  renderChart(seriesData[currentType]);
});

function renderChart(series) {
  chart = Highcharts.chart("hcContainer", {
    colors: colors,
    chart: {
      zoomType: "x",
      type: "area",
      height: 600,
      events: {
        drillup: function(e) {
          e.seriesOptions.name === "Overview"
            ? chart.setTitle({ text: "Procurement Funding" })
            : chart.setTitle({
                text: e.seriesOptions.path.replace(
                  ` » ${e.seriesOptions.title}`,
                  ``
                )
              });
        },
        drilldown: function(e) {
          chart.setTitle({ text: e.point.series.options.path });
          if (!e.seriesOptions) {
            let chart = this;
            let series = drilldownData[currentType][e.point.drilldownID];
            for (let i = 0; i < series.length; i++) {
              let colorIndex = i;
              if (i > colors.length) {
                colorIndex = i - colors.length;
              }
              series[i].color = colors[colorIndex];
              chart.addSingleSeriesAsDrilldown(e.point, series[i]);
            }
            chart.applyDrilldown();
          }
        }
      }
    },
    title: {
      text: "Procurement Funding"
    },
    subtitle: {
      text: "Click and drag to zoom in"
    },
    credits: {
      enabled: true,
      href: false,
      text: "CSIS Defense360 | Source: Defense Budget Analysis"
    },
    plotOptions: {
      area: {
        stacking: "normal",
        lineColor: null,
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: null,
          symbol: "circle",
          radius: 3
        },
        cursor: "pointer",
        trackByArea: true,
        stickyTracking: false
      }
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br>",
      pointFormatter: function() {
        let point =
          this.y > 999 && this.y < 999999
            ? Math.round((this.y / 1000) * 10) / 10
            : this.y > 999999 && this.y < 999999999
              ? Math.round((this.y / 1000000) * 10) / 10
              : this.y;
        let suffix =
          this.y > 999 && this.y < 999999
            ? "K"
            : this.y > 999999 && this.y < 999999999
              ? "M"
              : "";

        return `<span style="font-size:18px;color:${
          this.series.color
        }">●</span> ${this.series.options.title}: $${point}${suffix}`;
      }
    },
    legend: {
      labelFormatter: function() {
        return this.userOptions.title;
      },
      title: {
        text:
          '<br/><span style="font-size: 12px; color: #808080; font-weight: normal">(Click the fields below to hide. To dive deeper into a specific type of funding, click a point on the chart.)</span>'
      }
    },
    xAxis: {
      title: "Fiscal Year",
      allowDecimals: false,
      categories: years,
      tickmarkPlacement: "on",
      labels: {
        rotation: -90,
        formatter: function() {
          return this.value
            .toString()
            .slice(2, 4)
            .replace(/^/, "FY");
        }
      }
    },
    yAxis: {
      title: {
        text:
          "Total Obligational Authority in " +
          valueTypesInfo[currentType].yAxis +
          " Dollars"
      },
      labels: {
        formatter: function() {
          return this.axis.max > 999 && this.axis.max < 999999
            ? `$${this.value / 1000}K`
            : this.axis.max > 999999 && this.axis.max < 999999999
              ? `$${this.value / 1000000}M`
              : `$${this.value / 1000000000}B`;
        }
      }
    },
    series: series
  });
}

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
      font: '25px "expo-serif-pro",serif',
      fontWeight: "400"
    },
    widthAdjust: -60
  },
  subtitle: {
    style: {
      fontSize: "12px",
      fontFamily: '"expo-serif-pro",serif',
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
      fontSize: "13px",
      fontFamily: "'Source Sans Pro', 'Arial', sans-serif"
    },
    headerFormat:
      "<span style=\"font-size: 13px;text-align:center;margin-bottom: 5px;font-weight: bold;font-family: 'Source Sans Pro', arial, sans-serif;\">{point.key}</span><br/>"
  },
  xAxis: {
    labels: {
      style: {
        color: "#666",
        fontSize: "12px",
        fontFamily: '"expo-serif-pro",serif'
      }
    },
    title: {
      style: {
        color: "#666",
        fontSize: "14px",
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
        fontSize: "12px",
        fontFamily: '"expo-serif-pro",serif'
      },
      x: -3
    },
    title: {
      style: {
        color: "#666",
        fontSize: "14px",
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
      color: "#666",
      textDecoration: "none",
      fontWeight: "normal",
      cursor: "default"
    },
    activeDataLabelStyle: {
      color: "#666",
      textDecoration: "none",
      fontWeight: "normal",
      cursor: "default"
    }
  }
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);

function slugify(words) {
  var slug = "";
  words.forEach(function(word, i) {
    var prefix = "-";
    if (i == 0) {
      prefix = "";
    }
    slug += prefix + word;
  });
  slug = slug.replace(/\s+/g, "-").toLowerCase();
  return slug;
}
