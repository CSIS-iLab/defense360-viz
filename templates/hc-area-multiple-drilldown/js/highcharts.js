import Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';

if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
    Drilldown(Highcharts);
}

export default Highcharts;