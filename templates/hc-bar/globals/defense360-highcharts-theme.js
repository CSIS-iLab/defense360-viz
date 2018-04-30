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
    colors: ['#196c95', '#5db6d0', '#f9bc65', '#d66e42', '#4f9793', '#3e7a82', '#4b5255'],
    chart: {
        backgroundColor: '#FFF',
        border: 'none',
        color: '#000',
        plotShadow: false,
        height: 500
    },
    title: {
        style: {
            color: '#000',
            font: '25px "Abel", Arial, sans-serif',
            fontWeight: '400'
        },
        widthAdjust: -60
    },
    subtitle: {
        style: {
            fontSize: '12px',
            fontFamily: "'Abel', 'Arial', sans-serif",
            color: '#808080'
        }
    },
    credits: {
        style: {
            cursor: "default",
            fontFamily: "'Source Sans Pro', 'Arial', sans-serif",
            fontSize: '10px'
        }
    },
    tooltip: {
        style: {
            fontSize: '13px',
            fontFamily: "'Source Sans Pro', 'Arial', sans-serif"
        },
        headerFormat: '<span style="font-size: 13px;text-align:center;margin-bottom: 5px;font-weight: bold;font-family: \'Roboto\', arial, sans-serif;">{point.key}</span><br/>'
    },
    xAxis: {
        labels: {
            style: {
                color: '#666',
                fontSize: '12px',
                fontFamily: "'Abel', 'Arial', sans-serif"
            },
        },
        title: {
            style: {
                color: '#666',
                fontSize: '14px',
                fontFamily: "'Abel', 'Arial', sans-serif"

            }
        },
        gridLineWidth: 1,
        lineWidth: 0,
        tickColor: '#e6e6e6'
    },
    yAxis: {
        labels: {
            style: {
                color: '#666',
                fontSize: '12px',
                fontFamily: "'Abel', 'Arial', sans-serif"
            },
            x: -3
        },
        title: {
            style: {
                color: '#666',
                fontSize: '14px',
                fontFamily: "'Abel', 'Arial', sans-serif"
            },
            margin: 20
        },
        tickColor: '#e6e6e6'
    },
    legend: {
        title: {
            text: null,
            style: {
                fontFamily: "'Abel', 'Arial', sans-serif",
                fontSize: "15px",
                color: '#000',
                fontStyle: 'normal'
            }
        },
        itemStyle: {
            color: '#000',
            fontSize: '14px',
            fontFamily: "'Source Sans Pro', 'Arial', sans-serif",
            textOverflow: null

        },
        itemHoverStyle: {
            color: '#5db6d0'
        },
        margin: 30
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: '#5db6d0'
        },
        activeDataLabelStyle: {
            color: '#5db6d0'
        }
    }
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
